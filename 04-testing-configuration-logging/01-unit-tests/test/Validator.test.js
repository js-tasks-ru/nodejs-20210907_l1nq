const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    it('валидатор проверяет числовые поля', ()=>{
      const validator = new Validator({
        age: {
          type: 'number',
          min: 6,
          max: 10,
        },
      });

      const error = validator.validate({age: 12});

      expect(error).to.have.length(1);
      expect(error[0]).to.have.property('field').and.to.be.equal('age');
      expect(error[0]).to.have.property('error').and.to.be.equal('too big, expect 10, got 12');
    });
    it('валидатор проверяет числовые поля и строковые поля', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 6,
          max: 10,
        },
      });

      const error = validator.validate({name: 'Artem', age: 4});

      expect(error).to.have.length(2);
      expect(error[0]).to.have.property('field').and.to.be.equal('name');
      expect(error[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 5');
      expect(error[1]).to.have.property('field').and.to.be.equal('age');
      expect(error[1]).to.have.property('error').and.to.be.equal('too little, expect 6, got 4');
    });
    it('валидатор проверяет тип, при ошибке выводит ее, и переходит к следующему полю', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 6,
          max: 10,
        },
      });

      const error = validator.validate({name: 6, age: 5});

      expect(error).to.have.length(2);
      expect(error[0]).to.have.property('field').and.to.be.equal('name');
      expect(error[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(error[0]).to.have.property('field').and.to.be.equal('age');
      expect(error[0]).to.have.property('error').and.to.be.equal('too little, expect 6, got 5');
    });
  });
});
