import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnapShopFormService } from '../../services/snap-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { SnapShopValidators } from '../../validators/snap-shop-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  //creditCardYears: number[] = [];
  //creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  // initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";


  constructor(private formBuilder: FormBuilder,
              private snapShopFormService: SnapShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { };

  ngOnInit(): void { 

    // setup Stripe payment form
    this.setupStripePaymentForm();

    //const currentMonth = new Date().getMonth() + 1;
    //const currentYear = new Date().getFullYear();
    
    this.reviewCartDetails();

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,
                                        Validators.minLength(2),
                                        SnapShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required,
                                       Validators.minLength(2),
                                       SnapShopValidators.notOnlyWhiteSpace]),
        email: new FormControl(theEmail, [Validators.required,
                                    Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
                                     Validators.minLength(2),
                                     SnapShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required,
                                   Validators.minLength(2),
                                   SnapShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      SnapShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required,
                                     Validators.minLength(2),
                                     SnapShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required,
                                   Validators.minLength(2),
                                   SnapShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required,
                                      Validators.minLength(2),
                                      SnapShopValidators.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        /*cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required,
                                         Validators.minLength(2),
                                         SnapShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required,
                                         Validators.pattern('^([0-9]{4}\\s?){3}[0-9]{4}$|^([0-9]{4}\\s?){2}[0-9]{5}$|^[0-9]{13,19}$'),
                                         SnapShopValidators.luhnCheck]),
        securityCode: new FormControl('', [Validators.required,
                                           Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl(currentMonth, [Validators.required]),
        expirationYear: new FormControl(currentYear, [Validators.required])
        */
      })
    });

    //this.detectCardType();

    this.initializeFormOptions();

  }

  public get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  public get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  public get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  public get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  public get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  public get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  public get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  public get shippingAddressCountry() {
    //console.log('In shipping address country');
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  public get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  public get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  public get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  public get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  public get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  public get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  public get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  public get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  public get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  public get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  public get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  get cartItems() {
    return this.cartService.cartItems;
  }

  /*
  detectCardType(): void {
    const cardNumberControl = this.checkoutFormGroup.get('creditCard.cardNumber');
    const cardTypeControl = this.checkoutFormGroup.get('creditCard.cardType');

    cardNumberControl?.valueChanges.subscribe((rawValue: string) => {
      if (rawValue === null || rawValue === undefined) return;

      // Remove all non-digit characters
      const digitsOnly = rawValue.replace(/\D+/g, '');

      // Format: insert a space every 4 digits
      const formatted = digitsOnly.match(/.{1,4}/g)?.join(' ') ?? '';

      // Update the control with the formatted value, without emitting another event
      if (rawValue !== formatted) {
        cardNumberControl.setValue(formatted, { emitEvent: false });
      }

      // Detect card type based on first digit(s)
      const firstDigit = digitsOnly.charAt(0);
      const firstTwoDigits = parseInt(digitsOnly.substring(0, 2), 10);
      const currentType = cardTypeControl?.value;

      let detectedType = '';

      if (firstDigit === '4') {
        detectedType = 'Visa';
      } else if (
        (firstTwoDigits >= 51 && firstTwoDigits <= 55) ||
        (firstTwoDigits >= 22 && firstTwoDigits <= 27)
      ) {
        detectedType = 'Mastercard';
      }

      // Set the card type only if it's different from the current value
      if (detectedType !== currentType) {
        cardTypeControl?.setValue(detectedType, { emitEvent: false });
      }

      // If no digits remain, clear the card type
      if (!digitsOnly) {
        cardTypeControl?.setValue('', { emitEvent: false });
      }
    });
  }
  */

  setupStripePaymentForm() {
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });
  }

  private initializeFormOptions(): void {
    /*
    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    //console.log("startMonth: " + startMonth);

    this.snapShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        //console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.snapShopFormService.getCreditCardYears().subscribe(
      data => {
        //console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );
    */

    // populate countries
    this.snapShopFormService.getCountries().subscribe(
      data => {
        //console.log("Retrived countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      // Create a new object for billingAddress by copying values from shippingAddress
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        { ...this.checkoutFormGroup.controls['shippingAddress'].value }
      );

      // Copy the list of states from shippingAddress to billingAddress
      this.billingAddressStates = [...this.shippingAddressStates];
    } else {
      // Reset the billing address fields when the checkbox is unchecked
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // Clear the billing states to prevent incorrect selections
      this.billingAddressStates = [];
    }
  }

  debugFormErrors() {
  Object.keys(this.checkoutFormGroup.controls).forEach(key => {
    const control = this.checkoutFormGroup.get(key);
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(subKey => {
        const subControl = control.get(subKey);
        if (subControl?.invalid) {
          console.log(`❌ ${key}.${subKey}:`, subControl.errors);
          console.log(`   Value:`, subControl.value);
        }
      });
    }
  });
}

  onSubmit() {
    //console.log("Handling the submit buutton");
    //console.log("Form valid?", this.checkoutFormGroup.valid);
  
    if (this.checkoutFormGroup.invalid) {
      console.log("Form is INVALID - showing errors:");
      this.debugFormErrors(); 
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    if (this.totalPrice === 0 || this.totalQuantity === 0) {
      alert('Your cart is empty. Please add products before checkout.');
      this.router.navigateByUrl('/products');
      return;
    }

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long-way
    //let orderItems: OrderItem[] = [];
    //for (let i=0; i<cartItems.length; i++) {
    //  orderItems[i] = new OrderItem(cartItems[i]);
    //}
    // - short way of doing the same
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    
    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;


    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`);
    // if valid form then
    // - create payment intent
    // - confirm card payment
    // - place order

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line2: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false })
          .then((result: any) => {
            if (result.error) {
              // inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
            } else {
              // call REST API via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response: any) => {
                  alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                  // reset cart
                  this.resetCart();
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);
                }
              })
            }            
          });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    /*
    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          
          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
    */

    //console.log(this.checkoutFormGroup.get('customer')?.value);
    //console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);

    //console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    //console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  /*
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      // If the selected year is the current year, set the start month to the current month
      startMonth = new Date().getMonth() + 1;

      // Reset the selected month if it is earlier than the allowed start month
      const selectedMonth = Number(creditCardFormGroup.value.expirationMonth);
      if (selectedMonth < startMonth) {
        creditCardFormGroup.patchValue({ expirationMonth: startMonth });
      }
    } else {
      // If a future year is selected, allow all months
      startMonth = 1;
    }

    // Fetch and update the list of available credit card months
    this.snapShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
  */

  getStates(formGroupName: string) {
    const FormGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = FormGroup.value.country.code;
    const countryName = FormGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.snapShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        FormGroup.get('state').setValue(data[0]);
      }
    );
  }

  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }
}
