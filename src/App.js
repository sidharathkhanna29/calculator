import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer(state, {type, payload}){
    switch(type) {

      case ACTIONS.ADD_DIGIT:
        if(state.overWrite){
          return {
            ...state,
            currentOperand:payload.digit,
            overWrite:false
          }
        }
        if (payload.digit === "0" && state.currentOperand === "0") {
          return state
        }
        if(payload.digit === "." && state.currentOperand.includes(".") ){
           return state
        }
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`
        }

      case ACTIONS.CHOOSE_OPERATION:
        
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null
          }
        }
        if(state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand:null
        }

      case ACTIONS.CLEAR:
        return {}
        
      case ACTIONS.DELETE_DIGIT:
        if(state.currentOperand == null) {
          return state
        }
        if(state.overWrite){
          return {
            ...state,
            overWrite: false,
            currentOperand:null
          }
        } 
        if(state.currentOperand.length === 1){
          return {
            ...state,
            currentOperand: null
          }
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }

      case ACTIONS.EVALUATE:
        if(state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state
        }
        return {
          ...state,
          previousOperand: null,
          operation:null,
          currentOperand: evaluate(state),
          overWrite:true
        }
      default:
        return state
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
      case "+":
      computation = prev + current
      break
      case "-":
      computation = prev - current
      break
      case "*":
      computation = prev * current
      break
      case "÷":
      computation = prev / current
      break
      default:
        computation = null
  }

  return computation.toString()
}

function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  //dispatch({type:ACTIONS.ADD_DIGIT, payload:{digit:1}})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand"> {previousOperand} {operation}</div>
        <div className="current-operand">{currentOperand}</div>
        {/*
        <div className="previous-operand"> 123</div>
        <div className="current-operand">123445</div>
        */}
      </div>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation="÷"/>
      <DigitButton dispatch={dispatch} digit="7"/>
      <DigitButton dispatch={dispatch} digit="8"/>
      <DigitButton dispatch={dispatch} digit="9"/>
      <OperationButton dispatch={dispatch} operation="*"/>
      <DigitButton dispatch={dispatch} digit="4"/>
      <DigitButton dispatch={dispatch} digit="5"/>
      <DigitButton dispatch={dispatch} digit="6"/>
      <OperationButton dispatch={dispatch} operation="+"/>
      <DigitButton dispatch={dispatch} digit="1"/>
      <DigitButton dispatch={dispatch} digit="2"/>
      <DigitButton dispatch={dispatch} digit="3"/>
      <OperationButton dispatch={dispatch} operation="-"/>
      <DigitButton dispatch={dispatch} digit="."/>
      <DigitButton dispatch={dispatch} digit="0"/>
      <button className="span-two" onClick={() => dispatch({type:ACTIONS.EVALUATE})}>=</button>
      <br/>
      <footer text-align="center">@SidharathKhanna</footer>
      </div>                     
  );
}

export default App;
