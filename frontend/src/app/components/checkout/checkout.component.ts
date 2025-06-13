import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnapShopFormService } from '../../services/snap-shop-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { SnapShopValidators } from '../../validators/snap-shop-validators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private snapShopFormService: SnapShopFormService) { };

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required,
                                        Validators.minLength(2),
                                        SnapShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required,
                                       Validators.minLength(2),
                                       SnapShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('', [Validators.required,
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
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.snapShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years
    this.snapShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.snapShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrived countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
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
    console.log('In shipping address country');
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

  onSubmit() {
    console.log("Handling the submit buutton");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

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
}
