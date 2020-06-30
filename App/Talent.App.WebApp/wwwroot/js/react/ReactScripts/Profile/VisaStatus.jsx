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
			visaType: Joi.string().max(80),
			visaExpiryDate: Joi.date(),
		});

		this.state = {
			openEdit: false,
			visaType: "",
			visaTypeOptions: options,
			visaExpiryDate: "",
			schema: {},
		};
    }
    
    componentWillMount() {
        this.getVisaStatus();
    }

	handleChange(event, name = null, value = null) {
		event.preventDefault();
		console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		switch (event.target.name) {
			case undefined:
				dataname = name;
				this.setState({ [name]: value }, () => {
					// console.log(this.state.visaType);
					const validation = this.checkStateForValidation({
						visaType: this.state.visaType,
					});
					// console.log("Validation: ", !validation);
					data[dataname] = !validation;
					this.setState({ schema: data });
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

    }
    
    setVisaStatus(event) {
        event.preventDefault();
        
    }

	render() {
		return (
			<Grid container columns="equal">
				<Grid.Row>
					<Grid.Column>
						Visa type:
						<Select
							name="visaType"
							type="text"
							fluid
							onChange={(e, { name, value }) =>
								this.handleChange(e, name, value)
							}
							placeholder="Add visa type"
							value={
								this.state.visaType ? this.state.visaType : ""
							}
							options={this.state.visaTypeOptions}
						/>
					</Grid.Column>
					<Grid.Column>
						Visa Expiry Date:
						<Input
							name="visaExpiryDate"
							type="date"
							fluid
							onChange={(e) => this.handleChange(e)}
							placeholder="Add visa expiry date"
							value={
								this.state.visaExpiryDate
									? this.state.visaExpiryDate
									: ""
							}
						/>
					</Grid.Column>
					<Grid.Column verticalAlign={"middle"}>
						<Grid.Row>
							<Button
								secondary
								onClick={(e) => this.setVisaStatus(e)}
							>
								Save
							</Button>
						</Grid.Row>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
