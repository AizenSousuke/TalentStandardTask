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
			value: this.props.status,
		};
	}

	render() {
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
						checked={this.state.value == "1"}
						onClick={(e, { value }) => {
							console.log(value);
						}}
					/>
					<br />
					<Radio
						as="p"
						label={"Not looking for a job at the moment"}
						value={"Not looking for a job at the moment"}
						checked={this.state.value == "2"}
					/>
					<br />
					<Radio
						as="p"
						label={"Currently employed but open to offers"}
						value={"Currently employed but open to offers"}
						checked={this.state.value == "3"}
					/>
					<br />
					<Radio
						as="p"
						label={"Will be available on later date"}
						value={"Will be available on later date"}
						checked={this.state.value == "4"}
					/>
				</Grid.Column>
			</Grid>
		);
	}
}
