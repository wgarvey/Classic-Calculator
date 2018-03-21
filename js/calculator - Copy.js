/*
 * Simple Calculator
 * Author: William Garvey
 * Requires buttons on screen to call buttonClick(button_value)
 * Where the button_value ranges from values {0:9} and {'+','-','*','/','Clr','Clr-all','='}
 */

/*
 * Id of html element that will be used to set the calculators output
 * Output set using ".innerHtml = "
 */ 
var outputId = 'calc-output-text';


/* Used to store value of last calculation while user is entering a new number */
var valBuffer = 0;

/* 
 * param: used in sequential presses of '=' to 
 * continue the same operation by the same constant
 * as used in the first press of '=' 
 * ex: '10','+','5','=','15' '=' 20 '=' 25 '=' 30
 */
var param = 0; 
var outputBuffer = 0; // value of input/output on screen
var operator = "+"; // Last operation selected

/* 
 * Last button that user has presssed that does not 
 * include "." and "+/-"
 *
 * "." and "+/-" only modify 
 * the displayed number and do not affect future 
 * operations (other than changing the output as a parameter in operations)
 */
var ActionEnum = {
	NUM_ENTER: 1,	// '0' '1' ... '9'
	OPERATOR: 2, 	// '+' '-' '*' '/'
	EQUAL: 3, 		// '='
};

var lastAction = ActionEnum.NUM_ENTER; // As if user last entered a '0'

// Function called after every button press
function buttonClick(button_value){
	switch (button_value){
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
			onClickNumber(button_value);
			break;
			
		case "Clr-all":
			// clearing
			valBuffer = 0;
			operator = "+";
			param = 0; // These additional clear operations continue onto the
			// Regular clear operations that are cleared from regular "Clr" (vs Clr-all)
		case "Clr":
			outputBuffer = 0;
			lastAction = ActionEnum.NUM_ENTER // Resetting to NUM_ENTER as if user just entered a '0'
			break;
			
		case "+/-":
			// Negating calculator output/input of screen
			outputBuffer = -outputBuffer;
			// Not recorded as a action with lastAction
			break;
		case ".":
			// Hacky way of moving decimal point to left
			outputBuffer = outputBuffer/10;
			// Not recorded as a action with lastAction
			break;
		case "+":
		case "-":
		case "*":
		case "/":
			// Operation pressed
			onClickOperator(button_value);
			break;
		case "=":
			// calculate output
			onClickEquals()
			break; // Not needed
	}
	// Set calculator output after each button press
	document.getElementById(outputId).innerHTML = outputBuffer;
	
}

function onClickNumber(button_value){
	if (lastAction == ActionEnum.NUM_ENTER){
		outputBuffer = outputBuffer*10 + button_value; // Shift current outputBuffer to left by 10, add new number
	} else if (lastAction == ActionEnum.OPERATOR) {
		// Entering a new number after selecting an operator, so move current output
		// to valBuffer
		valBuffer = outputBuffer;
		outputBuffer = button_value;
	} else { /* LastAction == ActionEnum.EQUAL */
		/*
		 * Beginning to enter a new number after pressing '=' means
		 * the previous output will not be used in a future operation, so set valBuffer to 0
		 */
		valBuffer = 0;
		/*
		 * A new operator button press after this will result in in evaluating the last "expression". 
		 * Since the output of the last '=' is not important and therefore set to 0, to ensure
		 * that this expression evaluation does not affect anything, operator is set to "+"
		 * because that will result in outputBuffer = valBuffer + outputBuffer = 0 + outputBuffer
		 * otherwise you end up with something like outputBuffer = valBuffer/outputBuffer = 0/outputBuffer = 0
		 */
		operator = "+"; 
		outputBuffer = button_value; // Start of a new number being entered
	}
	lastAction = ActionEnum.NUM_ENTER
}

function onClickOperator(button_value){
	if (lastAction == ActionEnum.NUM_ENTER){
		// Evaluate whatever expression was last entered when pressing a new operator
		outputBuffer = evaluateExpression(operator, valBuffer, outputBuffer); // Set output to result
		operator = button_value; // NOW set operator to new operation
	} else if (lastAction == ActionEnum.OPERATOR) {
		operator = button_value; // re-selecting operator
	} else { /* LastAction == ActionEnum.EQUAL */
		valBuffer = outputBuffer;
		operator = button_value;
	}
	// Could "factor out" the operator-setting but it should be clear what is done
	lastAction = ActionEnum.OPERATOR
}

function onClickEquals(){
	if (lastAction == ActionEnum.NUM_ENTER){
		// Evaluate whatever expression was last entered when pressing a new operator
		param = outputBuffer; // set the param for sequential presses of '='
		outputBuffer = evaluateExpression(operator, valBuffer, outputBuffer);
		valBuffer = 0;
		lastAction = ActionEnum.EQUAL;
	} else if (lastAction == ActionEnum.OPERATOR) {
		// Doesn't really make sense to press '=' after pressing an operator, so don't make
		// anything happen and dont record this action.
	} else { /* LastAction == ActionEnum.EQUAL */
		/* 
		 * A 2nd or more press of '=' in a sequence of button presses
		 * Use param to work like a traditional calculator and continue the same operation as previously
		 * With the same constant
		 */ 
		outputBuffer = evaluateExpression(operator, outputBuffer, param);
		lastAction = ActionEnum.EQUAL
	}
}

/*
 * Giving an operator symbol/string and two parameters
 * return the result of the operation
 */
 function evaluateExpression(operator, param1, param2){
	switch(operator) {
		case "+":
			return param1 + param2;
		case "-":
			return param1 - param2;
		case "*":
			return param1 * param2;
		case "/":
			return param1 / param2
	}
}