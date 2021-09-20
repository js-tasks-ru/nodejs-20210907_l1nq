const stream = require('stream');
const os = require('os');


class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.word = '';
    this.part = [];
  }

  _transform(chunk, encoding, callback) {
    this.word += chunk;
    if (this.word.includes(os.EOL)) {
      this.word = this.word.split(os.EOL);
      for (const i of this.word) {
        if (this.word.indexOf(i) !== this.word.length - 1) {
          this.push(i);
        }
      }
      this.word.splice(0, this.word.length - 1);
      this.word = this.word[0];
      callback();
    } else {
      callback();
    }
  }

  _flush(callback) {
    callback(null, this.word);
  }
}

module.exports = LineSplitStream;
