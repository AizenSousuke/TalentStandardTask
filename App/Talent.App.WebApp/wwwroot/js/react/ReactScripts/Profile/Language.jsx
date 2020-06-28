/* Language section */
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
import Joi from "@hapi/joi";

export default class Language extends React.Component {
	constructor(props) {
		super(props);

		const options = [
			{
				key: "0",
				text: "Basic",
				value: "Basic",
			},
			{
				key: "1",
				text: "Intermediate",
				value: "Intermediate",
			},
			{
				key: "2",
				text: "Fluent",
				value: "Fluent",
			},
		];

		this.schema = Joi.object({
			language: Joi.string().max(80),
		});

		this.state = {
			openEdit: false,
			language: "",
			options: options,
			schema: this.schema,
		};
	}

	handleChange(event) {
		// console.log(event.target.value);
		this.setState({ language: event.target.value }, () =>
			console.log(this.state.language)
		);
	}

	openEdit(event = null) {
		this.setState({ openEdit: !this.state.openEdit }, () => {
			console.log("Open Edit: ", this.state.openEdit);
        });
        
        // Set the values in the edit if used from the edit button
        
	}

	render() {
		return (
			// <div className="ui sixteen wide column">
			<Grid container columns="equal">
				{this.state.openEdit && (
					<Grid.Row>
						<Grid.Column>
							<Input
								type="text"
								fluid
								onChange={(e) => this.handleChange(e)}
								placeholder="Add language"
								value={
									this.state.language
										? this.state.language
										: ""
								}
								error={this.state.schema.language}
							/>
							<Message
								negative
								hidden={!this.state.schema.language}
							>
								Language too long
							</Message>
						</Grid.Column>
						<Grid.Column>
							<Select
								placeholder={"Language Level"}
								options={this.state.options}
								fluid
							/>
						</Grid.Column>
						<Grid.Column>
							<Button
								color={"green"}
								onClick={this.addLanguage}
								fluid
							>
								Add
							</Button>
						</Grid.Column>
						<Grid.Column>
							<Button
								color={"grey"}
								onClick={this.cancelAddLanguage}
								fluid
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.openEdit();
                                }}
							>
								Cancel
							</Button>
						</Grid.Column>
					</Grid.Row>
				)}

				<Grid.Row>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHeaderCell width={6}>
									Language
								</TableHeaderCell>
								<TableHeaderCell width={6}>
									Level
								</TableHeaderCell>
								<TableHeaderCell>
									<Button
										color={"black"}
										fluid
										onClick={(e) => {
											e.preventDefault();
											this.openEdit();
										}}
									>
										Add New
									</Button>
								</TableHeaderCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell width={6}>Body Cell</TableCell>
								<TableCell width={6}>Body Cell</TableCell>
								<TableCell textAlign={"right"}>
									<Button
										basic
										icon="edit"
										size="mini"
										onClick={(e) => {
											e.preventDefault();
											this.openEdit(e);
										}}
									></Button>
									<Button
										basic
										icon="close"
										size="mini"
									></Button>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid.Row>
			</Grid>
			// </div>
		);
	}
}
