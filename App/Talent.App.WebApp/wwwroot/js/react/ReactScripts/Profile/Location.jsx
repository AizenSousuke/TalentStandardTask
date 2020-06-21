import React from "react";
import Cookies from "js-cookie";
import { default as Countries } from "../../../../util/jsonFiles/countries.json";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import { Select } from "../Form/Select.jsx";
import { countries } from "../Employer/common";

export class Address extends React.Component {
	constructor(props) {
		super(props);

		const addressData = props.addressData
			? Object.assign({}, props.addressData)
			: {
					number: "",
					street: "",
					suburb: "",
					postcode: 0,
					city: "",
					country: "",
			  };

		this.state = {
			showEditSection: false,
			newAddress: addressData,
		};

		this.openEdit = this.openEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveAddress = this.saveAddress.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);

		// Countries Array
		this.countries = [];
		Object.keys(Countries).map((key, i) => {
			this.countries.push({ title: key, value: i });
		});
		console.log(this.countries);

		// // Cities Array
		this.cities = [];
		Object.values(Countries).map((citiesArray, i) => {
		    this.cities.push({ title: citiesArray, value: i })
		});
        console.log(this.cities);

		// this.cities = [];
		// Object.keys(Countries).map((countries) => {
		//     console.log(countries.length);
		//     Object.keys(countries).map((cities) => {
		//         // console.log(cities);
		//     });
		// })
	}

	openEdit() {
		const address = Object.assign({}, this.props.addressData);
		this.setState({
			showEditSection: true,
			newAddress: address,
		});
	}

	closeEdit() {
		this.setState({
			showEditSection: false,
		});
	}

	handleChange(event) {
		const data = Object.assign({}, this.state.newAddress);
		data[event.target.name] = event.target.value;
		this.setState({
			newAddress: data,
		});
	}

	saveAddress() {
		console.log(this.props.componentId);
		console.log(this.state.newAddress);
		const data = Object.assign({}, this.state.newAddress);
		this.props.saveProfileData(data);
		this.closeEdit();
	}

	render() {
		return this.state.showEditSection
			? this.renderEdit()
			: this.renderDisplay();
	}

	renderEdit() {
		return (
			<div className="ui sixteen wide column">
				<ChildSingleInput
					inputType="number"
					label="Number"
					name="number"
					value={this.state.newAddress.number}
					controlFunc={this.handleChange}
					maxLength={3}
					placeholder="Enter your address number"
					errorMessage="Please enter a valid number"
				/>
				<ChildSingleInput
					inputType="text"
					label="Street"
					name="street"
					value={this.state.newAddress.street}
					controlFunc={this.handleChange}
					maxLength={80}
					placeholder="Enter your street"
					errorMessage="Please enter a valid street"
				/>
				<ChildSingleInput
					inputType="text"
					label="Suburb"
					name="suburb"
					value={this.state.newAddress.suburb}
					controlFunc={this.handleChange}
					maxLength={80}
					placeholder="Enter your suburb"
					errorMessage="Please enter a valid suburb"
				/>
				<ChildSingleInput
					inputType="number"
					label="Post Code"
					name="postcode"
					value={this.state.newAddress.postcode}
					controlFunc={this.handleChange}
					maxLength={12}
					placeholder="Enter your postcode"
					errorMessage="Please enter a valid postcode"
				/>
				Country:
				<Select
					name="country"
					controlFunc={this.handleChange}
					placeholder="Select a country"
					options={this.countries}
				/>
				{/* City:
                <Select 
                    name="city"
                    controlFunc={this.handleChange}
                    placeholder="Select a city"
                    options={Countries.countries}
                /> */}

				<button
					type="button"
					className="ui teal button"
					onClick={this.saveAddress}
				>
					Save
				</button>
				<button
					type="button"
					className="ui button"
					onClick={this.closeEdit}
				>
					Cancel
				</button>
			</div>
		);
	}

	renderDisplay() {
		let address = this.props.address
			? `${this.props.address.number} ${this.props.address.street} ${this.props.address.suburb} ${this.props.address.postcode}`
			: "";
		let city = this.props.address ? this.props.address.city : "";
		let country = this.props.address ? this.props.address.country : "";

		return (
			<div className="row">
				<div className="ui sixteen wide column">
					<React.Fragment>
						<p>Address: {address}</p>
						<p>City: {city}</p>
						<p>Country: {country}</p>
					</React.Fragment>
					<button
						type="button"
						className="ui right floated teal button"
						onClick={this.openEdit}
					>
						Edit
					</button>
				</div>
			</div>
		);
	}
}

export class Nationality extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {}
}
