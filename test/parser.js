var parser = require('parser');
var should = require('should');

describe('Parser', function(){
  describe('check type', function(){
    it('should return a JOSN', function(){
      var csvJSON = parser.csvJSON('some long string\n now')
      csvJSON.should.be.JSON
    })
  })

  describe('parse csvJ to JSON', function(){
    it('should accept file and return it', function(done){
      var csvJSON = parser.csvJSON('some long string\n now')
      JSON.stringify(csvJSON).should.equal('[{"some long string":" now"}]')
      done();
    })
  })

  describe('parseEmpty', function(){
    it('should retern notification', function(done){
      var csvJSON = parser.csvJSON('')
      JSON.stringify(csvJSON).should.equal('"empty file"')
      done();
    })
  })
})
