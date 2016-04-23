function List (){
  this.data = [];
  this.toBeDeleted = new Set();
  this.add = function(obj){
    this.data.push(obj);
  }
  this.delete = function(obj){
    this.toBeDeleted.add(obj);
  }
  this.length = function(){
    return this.data.length;
  }
  this.get = function(index){
    return this.data[index];
  }
  this.clean = function(){
    for (let obj of this.toBeDeleted){
      let i = this.data.indexOf(obj);
      if (i < 0) continue;
      this.data[i] = this.data[this.data.length - 1];
      this.data.pop();
    }
    this.toBeDeleted.clear();
  }
}


module.exports = List;
