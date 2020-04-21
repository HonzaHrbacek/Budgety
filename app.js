// *** BUDGETY APP *** //

/*
// BUDGET CONTROLLER
var budgetController = (function () {
  
  //Expense function constructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Income function constructor
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // It is best practice to have such neat data structure (e.g. in one object)
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        // This will assign id of the last element + 1 (this is useful e.g. in case some records (ids) were deleted)
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      // Create new item base on "inc" or "exp" type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Push new item into the data structure
      data.allItems[type].push(newItem);

      // Return new item
      return newItem;
    },

    testing: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER
var UIController = (function () {
  // It is practical to store classes into an object (in case we will change names of the classes)
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
  };

  return {
    // This will allow to use getInput method in controller module
    getInput: function () {
      return {
        // This will return a object with its properties which is used in controller module
        type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },

    // This method will make DOMstrings object public, i.e. usable in the controller module
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
// Logic: in Budget and UI controller there are created methods which are called in here
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault(); // prevents two logs into console when user firstly clicks and then presses enter
        ctrlAddItem("keyboard");
      }
    });
  };

  var ctrlAddItem = function (sender) {
    var input, newItem;

    // 1. Get input data

    input = UICtrl.getInput();
    // console.log(input); // only for testing
    // console.log("Hi there :)", sender); // only for testing

    // 2. Add item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    budgetCtrl.testing();

    // 3. Add item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  // Initialization function (called outsite the controller)
  return {
    init: function () {
      console.log("App has started.");
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
*/

// BUDGET CONTROLLER

var budgetController = (function () {
  // Expense function constructor

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //  Income function constructor

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Data structure

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      totalExp: 0,
      totalInc: 0,
    },
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);
      // We need to return newItem so that it can be used as a parameter of addListItem method
      return newItem;
    },
    test: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER

var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml, element;

      // Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder with some actual data

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert HTML into the DOM

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;

      // Fields are a list
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // This converts a list to an array
      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      // This will return focus on the description field
      fieldsArr[0].focus();
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
// Logic: in Budget and UI controller there are created methods which are called in here

var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();

        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function () {
    var input, newItem;

    console.log(event);
    console.log("It works :)");

    // 1. Get input data
    input = UICtrl.getInput();
    console.log(input);

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add item to the budget controller

      var newItem = budgetCtrl.addItem(
        input.type,
        input.description,
        input.value
      );

      budgetController.test();

      // 3. Add item to the UI

      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate the budget
      // 6. Display the budget in the UI
    }
  };

  return {
    init: function () {
      setupEventListeners();
      console.log("App has started.");
    },
  };
})(budgetController, UIController);

controller.init();
