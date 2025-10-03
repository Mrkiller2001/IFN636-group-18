const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp.default || chaiHttp);

const SensorReading = require('../models/SensorReading'); // adjust if file name differs
const Bin = require('../models/Bin');
const {
  addReading,     // POST /api/sensor-readings
  getHistory      // GET  /api/sensor-readings/bin/:binId
} = require('../controllers/sensorController');

function makeRes() {
  return { status: sinon.stub().returnsThis(), json: sinon.spy() };
}

// helper to stub find(...).sort(...)
function stubFindSort(resultArray) {
  const sortStub = sinon.stub().returns(resultArray);
  const findStub = sinon.stub(SensorReading, 'find').returns({ sort: sortStub });
  return { findStub, sortStub };
}

describe('Sensor Controller (unit)', () => {
  afterEach(() => sinon.restore());

  describe('addReading', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = { user: { id: 'u1' }, body: { binId: null, fillPct: null } };
      const res = makeRes();
      await addReading(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.called).to.be.true;
    });
    it('should return 403 if user is not authorized', async () => {
      const req = { user: null, body: { binId: 'b1', fillPct: 10 } };
      const res = makeRes();
      await addReading(req, res);
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.called).to.be.true;
    });
    it('creates reading, updates bin snapshot and sets needs_pickup at threshold', async () => {
      const binId = new mongoose.Types.ObjectId().toString();
      const userId = new mongoose.Types.ObjectId().toString();
      const req = {
        user: { id: userId },
        body: { binId, fillPct: 88, batteryPct: 70, takenAt: '2025-10-01T10:00:00Z' }
      };

      const createdReading = { _id: new mongoose.Types.ObjectId(), ...req.body, userId };
      sinon.stub(SensorReading, 'create').resolves(createdReading);

      const binDoc = {
        _id: binId,
        userId,
        latestFillPct: 0,
        status: 'normal',
        save: sinon.stub().resolvesThis()
      };
      sinon.stub(Bin, 'findOne').resolves(binDoc);

      const res = makeRes();
      await addReading(req, res);

      expect(SensorReading.create.calledOnce).to.be.true;
      expect(Bin.findOne.calledOnceWith({ _id: binId, userId })).to.be.true;
      expect(binDoc.latestFillPct).to.equal(88);
      expect(binDoc.status).to.equal('needs_pickup');
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdReading)).to.be.true;
    });

    it('500 on error', async () => {
      sinon.stub(SensorReading, 'create').throws(new Error('DB Error'));
      const req = { user: { id: 'u1' }, body: { binId: 'b1', fillPct: 10 } };
      const res = makeRes();

      await addReading(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  describe('getHistory', () => {
    it('should return 403 if user is not authorized', async () => {
      const binId = new mongoose.Types.ObjectId().toString();
      const req = { user: null, params: { binId } };
      const res = makeRes();
      await getHistory(req, res);
      expect(res.status.calledWith(403)).to.be.true;
      expect(res.json.called).to.be.true;
    });
    it('returns sorted reading history for a bin', async () => {
      const binId = new mongoose.Types.ObjectId().toString();
      const userId = new mongoose.Types.ObjectId().toString();
      const rows = [{ _id: 1, binId, fillPct: 10 }, { _id: 2, binId, fillPct: 20 }];

      const { findStub, sortStub } = stubFindSort(rows);

      const req = { user: { id: userId }, params: { binId } };
      const res = makeRes();

      await getHistory(req, res);

      expect(findStub.calledOnce).to.be.true;
      expect(findStub.firstCall.args[0]).to.deep.equal({ userId, binId });
      expect(sortStub.calledOnce).to.be.true;
      expect(res.json.calledWith(rows)).to.be.true;
    });

    it('500 on error', async () => {
      const binId = new mongoose.Types.ObjectId().toString();
      const userId = new mongoose.Types.ObjectId().toString();

      sinon.stub(SensorReading, 'find').throws(new Error('DB Error'));
      const req = { user: { id: userId }, params: { binId } };
      const res = makeRes();

      await getHistory(req, res);
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });
});
