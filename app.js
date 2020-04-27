/*
----- BUDGETY APP -----
*/

// ***** BUDGET CONTROLLER *****

var budgetController = (function () {
  // Expense function constructor

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  //  Income function constructor

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Private function that calculates total income and expense

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  // Data structure, it is best practice to have such neat data structure (e.g. in one object)

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  // General comment: we are returning object with methods that are called elsewhere
  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // Create new ID
      if (data.allItems[type].length === 0) {
        ID = 0;
      } else {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1; // This will assign id of the last element + 1 (this is useful e.g. in case some records (i.e. ids) were deleted by user)
      }

      // Create new item base on "inc" or "exp" type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Push new item into the data structure
      data.allItems[type].push(newItem);
      // We need to return newItem so that it can be used as a parameter of addListItem method
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id; // Map returns brand new array, in this case the array consists of all ids
      });

      index = ids.indexOf(id); // This will store index of the element with the appropriate id into index variable

      if (index !== -1) {
        data.allItems[type].splice(index, 1); // The splice() method adds/removes items to/from an array, and returns the removed item(s). This removes the item with the appropriate index
      }
    },

    calculateBudget: function () {
      // 1. Calculate total income and expense
      calculateTotal("exp");
      calculateTotal("inc");
      // 2. Calculate budget, i.e. income - expense
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate what % of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1; // This is useful for usage of the displayBudget method
      }
    },

    calculatePercentages: function () {
      // Calculate percentage for each expense object
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      // Return the array with percentages

      var allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    // Return getBudget so that it can be displayed in the UI
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    // Just testing method to check if data structure was updated based on user's input
    test: function () {
      console.log(data);
    },
  };
})();

// ***** UI CONTROLLER *****

var UIController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    percentageItemLabel: ".item__percentage",
    container: ".container",
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder with actual data

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert HTML into the DOM

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);

      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;

      // Fields are a NodeList. NodeLists are very similar to Array collections of elements, often referred to as “array-like”, but you can’t manipulate NodeLists the same way you can an Array - such as using Array methods such as slice() , map() , reduce()
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      // The slice()  method returns a new array of the same elements and by attaching it to the NodeList (which is stored in the variable 'fields'), it will think, hang on, this must be an array, I'll return it as a new array using the same elements it has
      fieldsArr = Array.prototype.slice.call(fields);

      // This replaces description and value with "". The anonymous function inside the forEach method is called on every Array element. It can take maximum 3 parameters (the value of the item, the index, the array itself), the order of these parameters is always the same  (so that's how JS knows to what piece of information we're referring to), the parameters can have any name we want and we don't need to use all 3 inside the function. UPDATE: the forEach() method was available on the NodeList starting from Chrome 51 / Firefox 50, which were released in 2016
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      // This will return focus on the description field
      fieldsArr[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
        document.querySelector(DOMstrings.percentageItemLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "n.a.";
        //document.querySelector(DOMstrings.percentageItemLabel).textContent = "n.a.";
      }
    },

    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

// ***** GLOBAL APP CONTROLLER *****
// Logic: in Budget and UI controller there are created methods which are called in here

var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault(); // prevents two logs into console when user firstly clicks and then presses enter
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem); // Here we are using "event delegation", the element "container" is the first parent container that both income and expenses elements have in common. More info in lecture 89.
  };

  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget in the UI
    UICtrl.displayBudget(budget);
    console.log(budget);
  };

  var updatePercentages = function () {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // 3. Update the UI
    console.log(percentages);
  };

  var ctrlAddItem = function () {
    var input, newItem;

    console.log(event);
    console.log("It works :) Git test");

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

      // 5. Calculate and update budget/display budget in the UI
      updateBudget();
    }

    // 6. Calculate and update percentages
    updatePercentages();
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; // We target the element where the event was fired and then move up through the DOM to the element which we want to manipulate and will retrieve  its id wich is the respective income or expense element). This is called "traversing" the DOM structure. Smarter solution using the Regular Expressions: https://www.udemy.com/course/the-complete-javascript-course/learn/lecture/5869254#questions/6723145
    console.log(itemID);

    // Usage of type coersion, itemID will be evaluated as true because it has a value
    if (itemID) {
      splitID = itemID.split("-"); // This split method returns an array of two element, e.g. ["inc", "0"].
      type = splitID[0];
      ID = parseInt(splitID[1]);
    }

    // 1. Delete item from data structure
    budgetCtrl.deleteItem(type, ID);

    // 2. Delete item from the UI
    UICtrl.deleteListItem(itemID);

    // 3. Update and show the budget
    updateBudget();

    // 4. Calculate and update percentages
    updatePercentages();
  };

  // Initialization function (called outsite the controller)
  return {
    init: function () {
      setupEventListeners();
      console.log("App has started.");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0,
      });
    },
  };
})(budgetController, UIController);

controller.init();
