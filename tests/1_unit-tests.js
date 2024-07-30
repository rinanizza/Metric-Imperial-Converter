const chai = require('chai');
const assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');
const server = require('../server'); // Adjust this path to your server file if necessary
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const convertHandler = new ConvertHandler();

suite('Unit Tests', function () {
  suite('Function convertHandler.getNum(input)', function () {
    test('Whole number input', function (done) {
      const input = '32L';
      assert.equal(convertHandler.getNum(input), 32);
      done();
    });

    test('Decimal Input', function (done) {
      const input = '32.2L';
      assert.equal(convertHandler.getNum(input), 32.2);
      done();
    });

    test('Fractional Input', function (done) {
      const input = '32/3L';
      assert.equal(convertHandler.getNum(input), 32 / 3);
      done();
    });

    test('Fractional Input with Decimal', function (done) {
      const input = '9/3.3L';
      assert.equal(convertHandler.getNum(input), 9 / 3.3);
      done();
    });

    test('Invalid Input (double fraction)', function (done) {
      const input = '32/3/3L';
      assert.equal(convertHandler.getNum(input), undefined);
      done();
    });

    test('No Numerical Input', function (done) {
      const input = 'L';
      assert.equal(convertHandler.getNum(input), 1);
      done();
    });
  });

  suite('Function convertHandler.getUnit(input)', function () {
    test('Valid Unit Inputs', function (done) {
      const inputs = [
        'gal', 'l', 'mi', 'km', 'lbs', 'kg',
        'GAL', 'L', 'MI', 'KM', 'LBS', 'KG'
      ];
      const expectedOutputs = [
        'gal', 'L', 'mi', 'km', 'lbs', 'kg',
        'gal', 'L', 'mi', 'km', 'lbs', 'kg'
      ];

      inputs.forEach((input, index) => {
        assert.equal(convertHandler.getUnit(input), expectedOutputs[index]);
      });
      done();
    });

    test('Unknown Unit Input', function (done) {
      const input = '34kilograms';
      assert.equal(convertHandler.getUnit(input), undefined);
      done();
    });
  });

  suite('Function convertHandler.getReturnUnit(initUnit)', function () {
    test('Valid Unit Inputs', function (done) {
      const inputs = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
      const expectedReturns = ['L', 'gal', 'km', 'mi', 'kg', 'lbs'];

      inputs.forEach((input, index) => {
        assert.equal(convertHandler.getReturnUnit(input), expectedReturns[index]);
      });
      done();
    });
  });

  suite('Function convertHandler.spellOutUnit(unit)', function () {
    test('Valid Unit Inputs', function (done) {
      const inputs = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
      const expectedOutputs = [
        'gallons', 'liters', 'miles', 'kilometers',
        'pounds', 'kilograms'
      ];

      inputs.forEach((input, index) => {
        assert.equal(convertHandler.spellOutUnit(input), expectedOutputs[index]);
      });
      done();
    });
  });

  suite('Function convertHandler.convert(num, unit)', function () {
    test('Gal to L', function (done) {
      const input = [5, 'gal'];
      const expected = 18.9271;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });

    test('L to Gal', function (done) {
      const input = [5, 'l'];
      const expected = 1.32086;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });

    test('Mi to Km', function (done) {
      const input = [5, 'mi'];
      const expected = 8.0467;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });

    test('Km to Mi', function (done) {
      const input = [5, 'km'];
      const expected = 3.10686;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });

    test('Lbs to Kg', function (done) {
      const input = [5, 'lbs'];
      const expected = 2.26796;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });

    test('Kg to Lbs', function (done) {
      const input = [5, 'kg'];
      const expected = 11.02312;
      assert.approximately(convertHandler.convert(input[0], input[1]), expected, 0.1);
      done();
    });
  });

  // Add the `after` hook here
  teardown(function() {
  chai.request(server)
    .get('/')
});
});


