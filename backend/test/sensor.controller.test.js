const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { expect } = chai;

const SensorReading = require('../models/SensorReading');
const Bin = require('../models/Bin');
const {
  addSensorReading,
  getReadingsForBin,
  deleteReading
} = require('../controllers/sensorController');

// Reusable fake res
function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.spy()
  };
}

describe('Sensor Controller - Ticket 3.1', () => {
  afterEach(() => sinon.restore());

  // ---------------------------
  // addSensorReading
  // ---------------------------
  describe('addSensorReading', () => {
    it('should create a sensor reading and update bin snapshot', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const binDoc = {
        _id: binId,
        userId,
        latestFillPct: 0,
        status: 'normal',
        latestReadingAt: null,
        save: sinon.stub().resolvesThis()
      };
      const readingDoc = {
        _id: new mongoose.Types.ObjectId(),
        userId, binId, fillPct: 85, batteryPct: 60, takenAt: new Date()
      };

      const findBinStub = sinon.stub(Bin, 'findOne').resolves(binDoc);
      const createReadingStub = sinon.stub(SensorReading, 'create').resolves(readingDoc);

      const req = {
        user: { id: userId },
        body: { binId, fillPct: 85, batteryPct: 60 }
      };
      const res = makeRes();

      await addSensorReading(req, res);

      expect(findBinStub.calledOnceWith({ _id: binId, userId })).to.be.true;
      expect(createReadingStub.calledOnceWithMatch({ userId, binId, fillPct: 85, batteryPct: 60 })).to.be.true;
      expect(binDoc.latestFillPct).to.equal(85);
      expect(binDoc.status).to.equal('needs_pickup'); // >= 80 flips status
      expect(binDoc.save.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(readingDoc)).to.be.true;
    });

    it('should return 400 if binId or fillPct invalid', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      const req = { user: { id: userId }, body: { binId: null, fillPct: '90' } }; // invalid
      const res = makeRes();

      await addSensorReading(req, res);
      expect(res.status.called).to.be.true;
      // First error is about binId; depending on order you may get either message
      const msg = res.json.firstCall.args[0]?.message || '';
      expect(msg.includes('binId') || msg.includes('fillPct')).to.be.true;
    });

    it('should return 404 if bin not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const findBinStub = sinon.stub(Bin, 'findOne').resolves(null);

      const req = { user: { id: userId }, body: { binId, fillPct: 50 } };
      const res = makeRes();

      await addSensorReading(req, res);

      expect(findBinStub.calledOnce).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bin not found' })).to.be.true;
    });

    it('should return 500 on DB error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const binDoc = { _id: binId, userId, save: sinon.stub().resolvesThis() };
      sinon.stub(Bin, 'findOne').resolves(binDoc);
      sinon.stub(SensorReading, 'create').throws(new Error('DB Error'));

      const req = { user: { id: userId }, body: { binId, fillPct: 42 } };
      const res = makeRes();

      await addSensorReading(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ---------------------------
  // getReadingsForBin
  // ---------------------------
  describe('getReadingsForBin', () => {
    // helper: stub find().sort().limit()
    function stubFindChain(resultArray) {
      const limitStub = sinon.stub().returns(resultArray);
      const sortStub = sinon.stub().returns({ limit: limitStub });
      const findStub = sinon.stub(SensorReading, 'find').returns({ sort: sortStub });
      return { findStub, sortStub, limitStub };
    }

    it('should return readings for a bin (sorted)', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      const binDoc = { _id: binId, userId };
      sinon.stub(Bin, 'findOne').resolves(binDoc);

      const readings = [
        { _id: new mongoose.Types.ObjectId(), binId, userId, fillPct: 70, takenAt: new Date() },
        { _id: new mongoose.Types.ObjectId(), binId, userId, fillPct: 55, takenAt: new Date(Date.now() - 1000) }
      ];
      const { findStub, sortStub, limitStub } = stubFindChain(readings);

      const req = { user: { id: userId }, params: { binId } };
      const res = makeRes();

      await getReadingsForBin(req, res);

      expect(findStub.calledOnceWith({ userId, binId })).to.be.true;
      expect(sortStub.calledOnceWith({ takenAt: -1 })).to.be.true;
      expect(limitStub.calledOnceWith(500)).to.be.true;
      expect(res.json.calledWith(readings)).to.be.true;
    });

    it('should return 404 if bin not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      sinon.stub(Bin, 'findOne').resolves(null);

      const req = { user: { id: userId }, params: { binId } };
      const res = makeRes();

      await getReadingsForBin(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Bin not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const binId = new mongoose.Types.ObjectId().toString();

      sinon.stub(Bin, 'findOne').resolves({ _id: binId, userId });
      sinon.stub(SensorReading, 'find').throws(new Error('DB Error'));

      const req = { user: { id: userId }, params: { binId } };
      const res = makeRes();

      await getReadingsForBin(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // ---------------------------
  // deleteReading
  // ---------------------------
  describe('deleteReading', () => {
    it('should delete a reading successfully', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const readingId = new mongoose.Types.ObjectId().toString();

      const doc = { deleteOne: sinon.stub().resolves() };
      const findOneStub = sinon.stub(SensorReading, 'findOne').resolves(doc);

      const req = { user: { id: userId }, params: { id: readingId } };
      const res = makeRes();

      await deleteReading(req, res);

      expect(findOneStub.calledOnceWith({ _id: readingId, userId })).to.be.true;
      expect(doc.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'Reading deleted' })).to.be.true;
    });

    it('should return 404 if reading not found', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const readingId = new mongoose.Types.ObjectId().toString();

      sinon.stub(SensorReading, 'findOne').resolves(null);

      const req = { user: { id: userId }, params: { id: readingId } };
      const res = makeRes();

      await deleteReading(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Reading not found' })).to.be.true;
    });

    it('should return 500 on error', async () => {
      const userId = new mongoose.Types.ObjectId().toString();
      const readingId = new mongoose.Types.ObjectId().toString();

      sinon.stub(SensorReading, 'findOne').throws(new Error('DB Error'));

      const req = { user: { id: userId }, params: { id: readingId } };
      const res = makeRes();

      await deleteReading(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });
});
