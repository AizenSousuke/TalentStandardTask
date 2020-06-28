import React from "react";
import Cookies from "js-cookie";
import { default as Countries } from "../../../../util/jsonFiles/countries.json";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import { Select } from "../Form/Select.jsx";
import { countries } from "../Employer/common";
import Joi from "@hapi/joi";
import { Dropdown, Divider, Button } from "semantic-ui-react";

export class Address extends React.Component {
	constructor(props) {
		super(props);

		const addressData = props.addressData
			? Object.assign({}, props.addressData)
			: {
					number: "",
					street: "",
					suburb: "",
					postCode: "",
					city: "",
					country: "",
			  };

		this.state = {
			showEditSection: false,
			newAddress: addressData,
			// For validation
			schema: {},
			// For address dropdown
			cities: [],
			countries: [],
		};

		// For validation
		const schema = Joi.object({
			number: Joi.number().max(999999999999),
			street: Joi.string(),
			suburb: Joi.string(),
			postCode: Joi.number().max(999999999999),
			country: Joi.string(),
			city: Joi.string(),
		});

		this.schema = schema;

		this.openEdit = this.openEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveAddress = this.saveAddress.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
		this.setCitiesArray = this.setCitiesArray.bind(this);
	}

	componentDidMount() {
		// Countries Array
		var countriesArray = [];
		Object.keys(Countries).map((key, i) => {
			countriesArray.push({ title: key, value: key });
		});

		this.setState({ countries: countriesArray }, () => {
			// console.log(this.state.countries);
		});
	}

	openEdit() {
		const address = Object.assign({}, this.props.addressData);
		this.setState({
			showEditSection: true,
			newAddress: address,
		});
		// Set cities array in case a country is already defined from props
		this.setCitiesArray(this.props.addressData.country);
	}

	closeEdit() {
		this.setState({
			showEditSection: false,
		});
	}

	handleChange(event) {
		this.handleValidation(event);
		const data = Object.assign({}, this.state.newAddress);
		// console.log("Data ", data);
		data[event.target.name] = event.target.value;
		this.setState({
			newAddress: data,
		});
	}

	handleValidation(event) {
		// Validation
		const { error, value } = this.schema.validate({
			[event.target.name]: event.target.value,
		});
		console.log("Validation Check for Field: ", error, value);
		// ==========
		if (error != undefined) {
			const data = Object.assign({}, this.state.schema);
			data[event.target.name] = true;
			this.setState({
				schema: data,
			});
		} else {
			const data = Object.assign({}, this.state.schema);
			data[event.target.name] = false;
			this.setState({
				schema: data,
			});
		}
	}

	checkStateForValidation(state) {
		const { value, error } = this.schema.validate(state);
		console.log("Validation State Check: ", value, error);
		if (error == undefined) {
			return true;
		} else {
			return false;
		}
	}

	saveAddress() {
		if (this.checkStateForValidation(this.state.newAddress)) {
			console.log(this.props.componentId);
			console.log(this.state.newAddress);
			const data = Object.assign({}, { address: this.state.newAddress });
			this.props.saveProfileData(data);
			this.closeEdit();
		} else {
			TalentUtil.notification.show(
				"Please check and resolve the errors. Remember to select a country and city.",
				"error",
				null,
				null
			);
		}
	}

	setCitiesArray(country) {
		var newCitiesArray = [];
		// console.log(this.countries.findIndex(e => e.value == "Singapore"));
		// console.log(this.cities[this.countries.findIndex(e => e.value == "Singapore")])
		Object.entries(Countries)
			.find((c) => c[0] == country)[1]
			.map((c) => {
				newCitiesArray.push({ title: c, value: c });
			});
		this.setState({ cities: newCitiesArray }, () => {
			// console.log("This cities: ", this.state.cities);
		});
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
					value={
						this.state.newAddress.number
							? this.state.newAddress.number
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={3}
					isError={this.state.schema.number}
					placeholder="Enter your address number"
					errorMessage="Please enter a valid number"
				/>
				<ChildSingleInput
					inputType="text"
					label="Street"
					name="street"
					value={
						this.state.newAddress.street
							? this.state.newAddress.street
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={80}
					isError={this.state.schema.street}
					placeholder="Enter your street"
					errorMessage="Please enter a valid street"
				/>
				<ChildSingleInput
					inputType="text"
					label="Suburb"
					name="suburb"
					value={
						this.state.newAddress.suburb
							? this.state.newAddress.suburb
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={80}
					isError={this.state.schema.suburb}
					placeholder="Enter your suburb"
					errorMessage="Please enter a valid suburb"
				/>
				<ChildSingleInput
					inputType="number"
					label="Post Code"
					name="postCode"
					value={
						this.state.newAddress.postCode
							? this.state.newAddress.postCode
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={12}
					isError={this.state.schema.postCode}
					placeholder="Enter your postcode"
					errorMessage="Please enter a valid postcode"
				/>
				Country:
				<Select
					name="country"
					controlFunc={(e) => {
						this.setCitiesArray(e.target.value);
						this.handleChange(e);
					}}
					placeholder="Select a country"
					selectedOption={this.state.newAddress.country}
					options={this.state.countries}
				/>
				City:
				{this.state.cities.length > 0 ||
				this.state.newAddress.city.length > 0 ? (
					<Select
						name="city"
						controlFunc={(e) => this.handleChange(e)}
						placeholder="Select a city"
						selectedOption={this.state.newAddress.city}
						options={this.state.cities}
					/>
				) : (
					<Select
						name="city"
						controlFunc={this.handleChange}
						placeholder="Select a country first"
						options={[]}
						disabled={true}
					/>
				)}
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
		let address = this.props.addressData
			? `${this.props.addressData.number} ${this.props.addressData.street} ${this.props.addressData.suburb} ${this.props.addressData.postCode}`
			: "";
		let city = this.props.addressData ? this.props.addressData.city : "";
		let country = this.props.addressData
			? this.props.addressData.country
			: "";

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
		this.state = {
			nationality: [],
		};
	}

	componentDidMount() {
		// Nationality Array
		var nationalityArray = [];
		Object.keys(Countries).map((key, i) => {
			nationalityArray.push({ title: key, value: key });
		});

		this.setState({ nationality: nationalityArray }, () => {
			console.log(this.state.nationality);
		});
	}

	render() {
		return (
			<div className="row">
				<div className="ui sixteen wide column">
					<Select
						name="nationality"
						selectedOption={this.props.nationalityData !== null ? this.props.nationalityData : ""}
						placeholder="Select your nationality"
						options={this.state.nationality}
						scrolling
						controlFunc={(e) => {
							console.log(e.target.value);
							const data = Object.assign({}, { nationality: e.target.value });
							this.props.saveProfileData(data);
							console.log(data);
						}}
					/>
				</div>
			</div>
		);
	}
}
