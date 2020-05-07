displayPercentages: function(percentages) {
  var fields = document.querySelectorAll(DOMstrings.percentagesItems);

  var nodeListForEach = function(list, callback) {
    for (i = 0; i < list.length; i++) {
      callback(list[i],i);
    }
  }

  nodeListForEach(fields, function(current, index) {
    if (percentages[index] > 0) {
      current.textContent = percentages[index] + "%";
      else {
        current.textContent = "n.a.";
      }
    }
  })

}