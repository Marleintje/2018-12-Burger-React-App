// l. 217
import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css'
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
  // l.228 (omzetting naar dit object) 
  state = {
    orderForm: {
      name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your Name'
        },
          value: ''
      },
      street: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Street'
        },
        value: ''
      },
      zipCode: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'ZIP Code'
        },
        value: ''
      },
      country: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Country'
        },
        value: ''
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Your E-mail'
        },
        value: ''
      },
      deliverymethod: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: 'fastest', displayValue: 'Fastest'},
            {value: 'cheapest', displayValue: 'Cheapest'},          
          ]
        },
        value: ''
      },
    },
    loading: false
  }

  orderHandler = (event) => {
    // Avoid sending request to reload the page
    event.preventDefault();

    // l. 232. We can take the values from the state because it's constantly
    // .. updated with two-way binding.
    this.setState({loading: true})
   
    // l. 232. Transformation of state to get only certain values.
    const formData = {}
    for (let formElementIdentifier in this.state.orderForm) {
      // simply set key-value pairs (e.g. country = Albania), Albania being value that user enters.
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }

    //l.172: .json is the appropriate endpoint syntax for firebase
    const order = {
      ingredients: this.props.ingredients,
      // In real-world set-up this would not be safe: you'd recalculate the price on the server
      price: this.props.price,
      orderData: formData
    }
    // second argument 'order' is the data that gets sent
    axios.post('/orders.json', order)
    // l. 173 purchasing: false zorgt ervoor dat de modal closes
      .then(response => {
        this.setState({loading: false });
        // l.178. History object beschikbaar doordat we props via de render method hebben
        // .. meegegeven onderaan in de checkout component. 
        this.props.history.push('/')
      })
      .catch(error => {
        this.setState({loading: false })
      });
  }

  // l.231 Handling User Input. 

  // Namelijk: als je typt, dan wordt dit in de input fields gevisualiseerd
  inputChangedHandler = (event, inputIdentifier) => {
    // l.231 Inmutably updating any effective form elements.
    // We need 2x the spread operator, to ensure
    // .. an actual deep copy of the nested objects.
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    // l. 231. Als je de Elemenconfig zou willlen gebruiken, dus 
    // .. nog een level dieper, moet je nog een keer spreaden
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    // Nested value aanpassen..
    updatedFormElement.value = event.target.value
    // .. met de aangepaste nested value het hele object aanpassen..
    updatedOrderForm[inputIdentifier] = updatedFormElement
    // .. en dan de state setten met het gehele object
    this.setState({orderForm: updatedOrderForm})
  }


  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm){
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let form = (
      // l. 232: onsubmit.
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => (
          <Input
            key={formElement.id} 
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            // L.231. Veranderd van changed={this.inputChangedHandler}
            // .. naar een arrow syntax, zodat we een argument kunnen meegeven.
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
          />
        ))}
        <Button 
          btnType="Success"
        >ORDER</Button>        
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

export default ContactData;