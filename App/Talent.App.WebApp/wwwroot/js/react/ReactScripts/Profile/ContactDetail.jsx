import React, { Component } from "react";
import Cookies from "js-cookie";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import { Location } from "../Employer/CreateJob/Location.jsx";
import Joi from "@hapi/joi";

export class IndividualDetailSection extends Component {
	constructor(props) {
		super(props);

		const details = props.details
			? Object.assign({}, props.details)
			: {
					firstName: "",
					lastName: "",
					email: "",
					phone: "",
			  };

		this.state = {
			showEditSection: false,
			newContact: details,
			// For validation
			schema: {},
		};

		// For validation
		const schema = Joi.object({
			firstName: Joi.string(),
			lastName: Joi.string(),
			email: Joi.string().email({ tlds: { allow: false } }),
			phone: Joi.number().max(999999999999),
		});

		this.schema = schema;

		this.openEdit = this.openEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleValidation = this.handleValidation.bind(this);
		this.saveContact = this.saveContact.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
	}

	openEdit() {
		const details = Object.assign({}, this.props.details);
		this.setState({
			showEditSection: true,
			newContact: details,
		});
	}

	closeEdit() {
		this.setState({
			showEditSection: false,
		});
	}

	handleChange(event) {
		this.handleValidation(event);
		const data = Object.assign({}, this.state.newContact);
		data[event.target.name] = event.target.value;
		this.setState({
			newContact: data,
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

	saveContact() {
		if (this.checkStateForValidation(this.state.newContact)) {
			console.log(this.props.componentId);
			console.log(this.state.newContact);
			const data = Object.assign({}, this.state.newContact);
			this.props.controlFunc(this.props.componentId, data);
			this.closeEdit();
		} else {
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}	
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
					inputType="text"
					label="First Name"
					name="firstName"
					value={
						this.state.newContact.firstName
							? this.state.newContact.firstName
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={80}
					isError={this.state.schema.firstName}
					placeholder="Enter your first name"
					errorMessage="Please enter a valid first name"
				/>
				<ChildSingleInput
					inputType="text"
					label="Last Name"
					name="lastName"
					value={
						this.state.newContact.lastName
							? this.state.newContact.lastName
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={80}
					isError={this.state.schema.lastName}
					placeholder="Enter your last name"
					errorMessage="Please enter a valid last name"
				/>
				<ChildSingleInput
					inputType="text"
					label="Email address"
					name="email"
					value={
						this.state.newContact.email
							? this.state.newContact.email
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={80}
					pattern={
						"([a-zA-Z_.]+)@([a-zA-Z]+)\\.([a-zA-Z]+)(.[a-zA-Z]+)?"
					}
					isError={this.state.schema.email}
					placeholder="Enter an email"
					errorMessage="Please enter a valid email"
				/>

				<ChildSingleInput
					inputType="text"
					label="Phone number"
					name="phone"
					value={
						this.state.newContact.phone
							? this.state.newContact.phone
							: ""
					}
					controlFunc={this.handleChange}
					maxLength={12}
					pattern={"[0-9]{0,12}"}
					isError={this.state.schema.phone}
					placeholder="Enter a phone number"
					errorMessage="Please enter a valid phone number"
				/>

				<button
					type="button"
					className="ui teal button"
					onClick={this.saveContact}
					disabled={this.props.disableButtons}
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
		let fullName = this.props.details
			? `${this.props.details.firstName} ${this.props.details.lastName}`
			: "";
		let email = this.props.details ? this.props.details.email : "";
		let phone = this.props.details ? this.props.details.phone : "";

		return (
			<div className="row">
				<div className="ui sixteen wide column">
					<React.Fragment>
						<p>Name: {fullName}</p>
						<p>Email: {email}</p>
						<p>Phone: {phone}</p>
					</React.Fragment>
					<button
						type="button"
						className="ui right floated teal button"
						onClick={this.openEdit}
						disabled={this.props.disableButtons}
					>
						Edit
					</button>
				</div>
			</div>
		);
	}
}

export class CompanyDetailSection extends Component {
	constructor(props) {
		super(props);

		const details = props.details
			? Object.assign({}, props.details)
			: {
					name: "",
					email: "",
					phone: "",
			  };

		this.state = {
			showEditSection: false,
			newContact: details,
		};

		this.openEdit = this.openEdit.bind(this);
		this.closeEdit = this.closeEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.saveContact = this.saveContact.bind(this);
		this.renderEdit = this.renderEdit.bind(this);
		this.renderDisplay = this.renderDisplay.bind(this);
	}

	openEdit() {
		const details = Object.assign({}, this.props.details);
		this.setState({
			showEditSection: true,
			newContact: details,
		});
	}

	closeEdit() {
		this.setState({
			showEditSection: false,
		});
	}

	handleChange(event) {
		const data = Object.assign({}, this.state.newContact);
		data[event.target.name] = event.target.value;
		this.setState({
			newContact: data,
		});
	}

	saveContact() {
		const data = Object.assign({}, this.state.newContact);
		this.props.controlFunc(this.props.componentId, data);
		this.closeEdit();
	}

	render() {
		return this.state.showEditSection
			? this.renderEdit()
			: this.renderDisplay();
	}

	renderEdit() {
		let location = { city: "", country: "" };
		if (this.state.newContact && this.state.newContact.location) {
			location = this.state.newContact.location;
		}

		return (
			<div className="ui sixteen wide column">
				<ChildSingleInput
					inputType="text"
					label="Name"
					name="name"
					value={this.state.newContact.name}
					controlFunc={this.handleChange}
					maxLength={80}
					placeholder="Enter your last name"
					errorMessage="Please enter a valid name"
				/>
				<ChildSingleInput
					inputType="text"
					label="Email address"
					name="email"
					value={this.state.newContact.email}
					controlFunc={this.handleChange}
					maxLength={80}
					placeholder="Enter an email"
					errorMessage="Please enter a valid email"
				/>
				<ChildSingleInput
					inputType="text"
					label="Phone number"
					name="phone"
					value={this.state.newContact.phone}
					controlFunc={this.handleChange}
					maxLength={12}
					placeholder="Enter a phone number"
					errorMessage="Please enter a valid phone number"
				/>
				Location:
				<Location
					location={location}
					handleChange={this.handleChange}
				/>
				<button
					type="button"
					className="ui teal button"
					onClick={this.saveContact}
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
		let companyName = this.props.details ? this.props.details.name : "";
		let email = this.props.details ? this.props.details.email : "";
		let phone = this.props.details ? this.props.details.phone : "";
		let location = { city: "", country: "" };
		if (this.props.details && this.props.details.location) {
			location = this.props.details.location;
		}

		return (
			<div className="row">
				<div className="ui sixteen wide column">
					<React.Fragment>
						<p>Name: {companyName}</p>
						<p>Email: {email}</p>
						<p>Phone: {phone}</p>
						<p>
							{" "}
							Location: {location.city}, {location.country}
						</p>
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
