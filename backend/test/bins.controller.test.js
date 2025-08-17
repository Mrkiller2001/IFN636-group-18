const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { expect } = chai;
chai.use(chaiHttp);

// Controllers & Model under test
const Bin = require('../src/models/Bin'); // adjust path if your model is elsewhere
const {
  getBins, addBin, getBin, updateBin, deleteBin, getBinsLatest
} = require('../src/controllers/binsController'); // adjust path if needed

// Reusable fake res
function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.spy()
  };
}

// Helper to stub Bin.find(...).sort(...) chain
function stubFindChain(resultArray) {
  const sortStub = sinon.stub().returns(resultArray);
  const findStub = sinon.stub(Bin, 'find').returns({ sort: sortStub });
  return { findStub, sortStub };
}

describe('Bins Controller - Ticket 2.1', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ---------------------------
  // addBin
  // ---------------------------
  describe('addBin', () => {
    it('should create a new bin successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const req = {
        user: { id: userId },
        body: {
          name: 'King & Ann',
          type: 'recycle',
          capacityLitres: 240,
          location: { lat: -27.462, lng: 153.028 },
          installedAt: '2024-01-15'
        }
      };

      const created = { _id: new mongoose.Types.ObjectId(), userId, ...req.body };
      const createStub = sinon.stub(Bin, 'create').resolves(created);

      const res = makeRes();
      await addBin(req, res);

      expect(createStub.calledOnceWith({
        userId,
        name: 'King & Ann',
        type: 'recycle',
        capacityLitres: 240,
        location: { lat: -27.462, lng: 153.028 },
        installedAt: '2024-01-15',
        status: 'normal',
        latestFillPct: 0
      })).to.be.true;

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const req = {
        user: { id: userId },
        body: { name: 'X', type: 'general', capacityLitres: 120, location: { lat: 0, lng: 0 } }
      };

      const createStub = sinon.stub(Bin, 'create').throws(new Error('DB Error'));
      const res = makeRes();

      await addBin(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

      createStub.restore();
    });
  });

  // ---------------------------
  // getBins
  // ---------------------------
  describe('getBins', () => {
    it('should return bins for the user (filter+sort chain)', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const bins = [
        { _id: new mongoose.Types.ObjectId(), name: 'A', userId },
        { _id: new mongoose.Types.ObjectId(), name: 'B', userId }
      ];

      const { findStub, sortStub } = stubFindChain(bins);

      const req = { user: { id: userId }, query: {} };
      const res = makeRes();

      await getBins(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(findStub.firstCall.args[0]).to.deep.equal({ userId });
      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true;
      expect(res.json.calledWith(bins)).to.be.true;
      expect(res.status.called).to.be.false;
    });

    it('should support type/status filters', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const bins = [];

      const { findStub } = stubFindChain(bins);
      const req = { user: { id: userId }, query: { type: 'recycle', status: 'normal' } };
      const res = makeRes();

      await getBins(req, res);
      expect(findStub.firstCall.args[0]).to.deep.equal({ userId, type: 'recycle', status: 'normal' });
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const findStub = sinon.stub(Bin, 'find').throws(new Error('DB Error'));

      const req = { user: { id: userId }, query: {} };
      const res = makeRes();

      await getBins(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

      findStub.restore();
    });
  });

  // ---------------------------
  // getBin
  // ---------------------------
  describe('getBin', () => {
    it('should return a bin by id', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();
      const bin = { _id: binId, userId, name: 'Bin Z' };

      const findOneStub = sinon.stub(Bin, 'findOne').resolves(bin);

      const req = { user: { id: userId }, params: { id: binId } };
      const res = makeRes();

      await getBin(req, res);

      expect(findOneStub.calledOnceWith({ _id: binId, userId })).to.be.true;
      expect(res.json.calledWith(bin)).to.be.true;
      expect(res.status.called).to.be.false;
    });

    it('should return 404 if bin not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findOneStub = sinon.stub(Bin, 'findOne').resolves(null);

      const req = { user: { id: userId }, params: { id: binId } };
      const res = makeRes();

      await getBin(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bin not found' })).to.be.true;

      findOneStub.restore();
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findOneStub = sinon.stub(Bin, 'findOne').throws(new Error('DB Error'));
      const req = { user: { id: userId }, params: { id: binId } };
      const res = makeRes();

      await getBin(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;

      findOneStub.restore();
    });
  });

  // ---------------------------
  // updateBin
  // ---------------------------
  describe('updateBin', () => {
    it('should update a bin successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const existing = {
        _id: binId,
        userId,
        name: 'Old Name',
        type: 'general',
        capacityLitres: 100,
        location: { lat: 0, lng: 0 },
        status: 'normal',
        installedAt: new Date(),
        save: sinon.stub().resolvesThis()
      };

      const findOneStub = sinon.stub(Bin, 'findOne').resolves(existing);

      const req = {
        user: { id: userId },
        params: { id: binId },
        body: { name: 'New Name', capacityLitres: 140, status: 'out_of_service' }
      };
      const res = makeRes();

      await updateBin(req, res);

      expect(findOneStub.calledOnceWith({ _id: binId, userId })).to.be.true;
      expect(existing.name).to.equal('New Name');
      expect(existing.capacityLitres).to.equal(140);
      expect(existing.status).to.equal('out_of_service');
      expect(existing.save.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      expect(res.status.called).to.be.false;
    });

    it('should return 404 when bin not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findOneStub = sinon.stub(Bin, 'findOne').resolves(null);
      const req = { user: { id: userId }, params: { id: binId }, body: {} };
      const res = makeRes();

      await updateBin(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bin not found' })).to.be.true;

      findOneStub.restore();
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findOneStub = sinon.stub(Bin, 'findOne').throws(new Error('DB Error'));
      const req = { user: { id: userId }, params: { id: binId }, body: {} };
      const res = makeRes();

      await updateBin(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.called).to.be.true;

      findOneStub.restore();
    });
  });

  // ---------------------------
  // deleteBin
  // ---------------------------
  describe('deleteBin', () => {
    it('should delete a bin successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const doc = { deleteOne: sinon.stub().resolves() };
      const findOneStub = sinon.stub(Bin, 'findOne').resolves(doc);

      const req = { user: { id: userId }, params: { id: binId } };
      const res = makeRes();

      await deleteBin(req, res);

      expect(findOneStub.calledOnceWith({ _id: binId, userId })).to.be.true;
      expect(doc.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Bin deleted' })).to.be.true;
    });

    it('should return 404 if bin not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findOneStub = sinon.stub(Bin, 'findOne').resolves(null);
      const req = { user: { id: userId }, params: { id: binId } };
      const res = makeRes();

      await deleteBin(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bin not found' })).to.be.true;

      findOneStub.restore();
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findOneStub = sinon.stub(Bin, 'findOne').throws(new Error('DB Error'));
      const req = { user: { id: userId }, params: { id: binId } };
      const res = makeRes();

      await deleteBin(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

      findOneStub.restore();
    });
  });

  // ---------------------------
  // getBinsLatest
  // ---------------------------
  describe('getBinsLatest', () => {
    it('should return latest snapshots list', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const bins = [
        { _id: new mongoose.Types.ObjectId(), name: 'Snap', latestFillPct: 67, userId }
      ];
      const { findStub, sortStub } = stubFindChain(bins);

      const req = { user: { id: userId } };
      const res = makeRes();

      await getBinsLatest(req, res);

      // Expect projection call shape; we only check the first arg (filter)
      expect(findStub.firstCall.args[0]).to.deep.equal({ userId });
      expect(sortStub.calledOnceWith({ updatedAt: -1 })).to.be.true;
      expect(res.json.calledWith(bins)).to.be.true;
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const findStub = sinon.stub(Bin, 'find').throws(new Error('DB Error'));

      const req = { user: { id: userId } };
      const res = makeRes();

      await getBinsLatest(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

      findStub.restore();
    });
  });
});
