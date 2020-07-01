import React from "react";
import Cookies from "js-cookie";
import {
	Dropdown,
	Grid,
	Select,
	Button,
	Input,
	Message,
	Table,
	TableHeader,
	TableHeaderCell,
	TableBody,
	TableCell,
	Icon,
	TableRow,
} from "semantic-ui-react";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import Joi, { options } from "@hapi/joi";

export default class VisaStatus extends React.Component {
	constructor(props) {
		super(props);

		const options = [
			{
				key: "0",
				text: "Citizen",
				value: "Citizen",
			},
			{
				key: "1",
				text: "Permanent Resident",
				value: "Permanent Resident",
			},
			{
				key: "2",
				text: "Work Visa",
				value: "Work Visa",
			},
			{
				key: "3",
				text: "Student Visa",
				value: "Student Visa",
			},
		];

		this.schema = Joi.object({
			visaStatus: Joi.string().max(80),
			visaExpiryDate: Joi.date(),
		});

		this.state = {
			openEdit: false,
			visaStatus: "",
			visaStatusOptions: options,
			visaExpiryDate: "",
			schema: {},
		};
	}

	handleChange(event, name = null, value = null) {
		event.preventDefault();
		this.getVisaStatus();
		console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		switch (event.target.name) {
			case undefined:
				dataname = name;
				this.setState({ [name]: value }, () => {
					// console.log(this.state.visaStatus);
					const validation = this.checkStateForValidation({
						visaStatus: this.state.visaStatus,
					});
					// console.log("Validation: ", !validation);
					data[dataname] = !validation;
					this.setState({ schema: data });
					// Update visa status and expiry date if any
					console.log("Setting visa status");
					this.setVisaStatus();
				});
				break;
			default:
				dataname = event.target.name;
				this.setState(
					{ [event.target.name]: event.target.value },
					() => {
						// console.log(this.state.visaExpiryDate);
						const validation = this.checkStateForValidation({
							visaExpiryDate: this.state.visaExpiryDate,
						});
						// console.log("Validation: ", !validation);
						data[dataname] = !validation;
						this.setState({ schema: data });
						// Update visa status and expiry date if any
						console.log("Setting visa status");
						this.setVisaStatus();
					}
				);
				break;
		}
	}

	checkStateForValidation(state) {
		const { value, error } = this.schema.validate(state);
		// console.log("Validation State Check: ", value, error);
		if (error == undefined) {
			return true;
		} else {
			return false;
		}
	}

	getVisaStatus() {
		console.log(
			"Getting visa status:",
			this.props.visaStatus,
			this.props.visaExpiryDate
		);

		this.setState(
			{
				visaStatus: this.props.visaStatus,
				visaExpiryDate: this.props.visaExpiryDate,
			},
			() => {
				console.log(
					"Visa status set state:",
					this.state.visaStatus,
					this.state.visaExpiryDate
				);
			}
		);
	}

	setVisaStatus(event = null) {
		if (event) {
			event.preventDefault();
		}
		// console.log("Saving visa with type: ", this.state.visaStatus);
		if (
			this.checkStateForValidation({
				visaStatus: this.state.visaStatus,
				visaExpiryDate:
					(this.state.visaStatus !== "Citizen" &&
					this.state.visaStatus !== "Permanent Resident")
						? this.state.visaExpiryDate
						: undefined,
			})
		) {
			console.log(
				"Visa type",
				this.state.visaStatus,
				this.state.visaExpiryDate
			);
			// Clear warning
			this.setState({ schema: {} });

			switch (this.state.visaStatus) {
				case "Work Visa":
					this.visaUpdate(
						this.state.visaStatus,
						this.state.visaExpiryDate
					);
					console.log("Updating visa with expiry date");
					break;
				case "Student Visa":
						this.visaUpdate(
							this.state.visaStatus,
							this.state.visaExpiryDate
						);
						console.log("Updating visa with expiry date");
						break;
				default:
					this.visaUpdate(this.state.visaStatus);
					break;
			}
		} else {
			// Set warning
			this.setState({ schema: { visaExpiryDate: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	visaUpdate(status, expiryDate = null) {
		const data = Object.assign(
			{},
			{
				visaStatus: status,
				visaExpiryDate: expiryDate,
			}
		);
		console.log("Visa Update Data: ", data);
		this.props.saveProfileData(data);
	}

	render() {
		return (
			<Grid container columns="equal">
				<Grid.Row>
					<Grid.Column width={4}>
						Visa type:
						<Select
							name="visaStatus"
							type="text"
							fluid
							onChange={(e, { name, value }) =>
								this.handleChange(e, name, value)
							}
							placeholder="Add visa type"
							value={
								this.props.visaStatus
									? this.props.visaStatus
									: ""
							}
							options={this.state.visaStatusOptions}
						/>
					</Grid.Column>
					{this.props.visaStatus !== "Citizen" &&
						this.props.visaStatus !== "Permanent Resident" && (
							<React.Fragment>
								<Grid.Column width={4}>
									Visa Expiry Date:
									<Input
										name="visaExpiryDate"
										type="date"
										fluid
										onChange={(e) => this.handleChange(e)}
										placeholder="Add visa expiry date"
										value={
											this.props.visaExpiryDate
												? this.props.visaExpiryDate.slice(0, 10)
												: ""
										}
										error={this.state.schema.visaExpiryDate}
									/>
								</Grid.Column>
								<Grid.Column verticalAlign={"middle"}>
									<Grid.Row>
										<Button
											secondary
											onClick={(e) =>
												this.setVisaStatus(e)
											}
										>
											Save
										</Button>
									</Grid.Row>
								</Grid.Column>
							</React.Fragment>
						)}
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Message
							negative
							hidden={!this.state.schema.visaExpiryDate}
						>
							Please enter the visa expiry date.
						</Message>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
