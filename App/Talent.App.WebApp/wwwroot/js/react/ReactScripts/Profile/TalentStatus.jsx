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
	Radio,
	Form,
} from "semantic-ui-react";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import Joi from "@hapi/joi";

export default class TalentStatus extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			availableDate: this.props.status.availableDate !== undefined ? this.props.status.availableDate : null,
		};
	}

	handleChange(status) {
		this.setState({ status: status });
		const jobSeekingStatus = Object.assign(
			{},
			{
				jobSeekingStatus: {
					status: status,
					availableDate: this.state.availableDate !== undefined ? this.props.status.availableDate : null,
				},
			}
		);
		this.props.saveProfileData(jobSeekingStatus);
	}

	handleAvailableDate(event) {
		this.setState({ availableDate: event.target.value }, () => {
			this.handleChange(this.props.status.status);
		});
	}

	render() {
		let availableDate = "";
		if (this.props.status !== null) {
			if (this.props.status.availableDate !== undefined ? this.props.status.availableDate : null) {
				availableDate = new Date(
					new Date(this.props.status.availableDate).getFullYear(),
					new Date(this.props.status.availableDate).getMonth(),
					new Date(this.props.status.availableDate).getDate() + 1
				)
					.toISOString()
					.slice(0, 10);
			}
		}
		return (
			<Grid container columns="equal">
				<Grid.Column>
					<Grid.Row>
						<b>Current Status:</b>
					</Grid.Row>
					<br />
					<Radio
						as="p"
						label={"Actively looking for a job"}
						value={"Actively looking for a job"}
						checked={
							this.props.status.status ===
								"Actively looking for a job" ||
							this.props.status.status == null
								? true
								: false
						}
						onClick={(e, { value }) => {
							this.handleChange(value);
						}}
					/>
					<br />
					<Radio
						as="p"
						label={"Not looking for a job at the moment"}
						value={"Not looking for a job at the moment"}
						checked={
							this.props.status.status ===
							"Not looking for a job at the moment"
								? true
								: false
						}
						onClick={(e, { value }) => {
							this.handleChange(value);
						}}
					/>
					<br />
					<Radio
						as="p"
						label={"Currently employed but open to offers"}
						value={"Currently employed but open to offers"}
						checked={
							this.props.status.status ===
							"Currently employed but open to offers"
								? true
								: false
						}
						onClick={(e, { value }) => {
							this.handleChange(value);
						}}
					/>
					<br />
					<Radio
						as="p"
						label={"Will be available on later date"}
						value={"Will be available on later date"}
						checked={
							this.props.status.status ===
							"Will be available on later date"
								? true
								: false
						}
						onClick={(e, { value }) => {
							this.handleChange(value);
						}}
					/>
					{this.props.status.status ===
						"Will be available on later date" && (
						<Input
							name="availableDate"
							type="date"
							fluid
							onChange={(e) => this.handleAvailableDate(e)}
							placeholder="Add availability date"
							value={
								this.props.status.availableDate !== "" &&
								this.props.status.availableDate !== null
									? availableDate
									: ""
							}
						/>
					)}
				</Grid.Column>
			</Grid>
		);
	}
}
