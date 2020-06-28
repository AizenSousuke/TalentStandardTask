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
			languageLevel: Joi.string().max(80),
		});

		this.state = {
			openEdit: false,
			language: "",
			languageLevel: "",
			options: options,
			// For validation
			schema: {},
		};
	}

	handleChange(event, name = null, value = null) {
		// console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		switch (event.target.name) {
			case undefined:
				dataname = name;
				this.setState({ [name]: value }, () => {
					console.log(this.state.languageLevel);
					const validation = this.checkStateForValidation({
						languageLevel: this.state.languageLevel,
					});
					console.log("Validation: ", !validation);
					data[dataname] = !validation;
					this.setState({ schema: data });
				});
				break;
			default:
				dataname = event.target.name;
				this.setState(
					{ [event.target.name]: event.target.value },
					() => {
						console.log(this.state.language);
						const validation = this.checkStateForValidation({
							language: this.state.language,
						});
						console.log("Validation: ", !validation);
						data[dataname] = !validation;
						this.setState({ schema: data });
					}
				);
				break;
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

	openEdit(event = null) {
		this.setState({ openEdit: !this.state.openEdit }, () => {
			console.log("Open Edit: ", this.state.openEdit);
		});

		// Set the values in the edit if used from the edit button
	}

	addLanguage() {
		// Validate first
		if (
			this.checkStateForValidation({
				language: this.state.language,
				languageLevel: this.state.languageLevel,
			})
		) {
			console.log("Adding language");
		} else {
            this.setState({ schema: { language: true }});
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	render() {
		return (
			// <div className="ui sixteen wide column">
			<Grid container columns="equal">
				{this.state.openEdit && (
					<React.Fragment>
						<Grid.Row>
							<Grid.Column>
								<Input
									name="language"
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
							</Grid.Column>
							<Grid.Column>
								<Select
									name="languageLevel"
									placeholder={"Language Level"}
									value={this.state.languageLevel}
									options={this.state.options}
									onChange={(e, { name, value }) => {
										e.preventDefault();
										this.handleChange(e, name, value);
									}}
									fluid
								/>
							</Grid.Column>
							<Grid.Column>
								<Button
									color={"green"}
									onClick={(e) => {
										e.preventDefault();
										this.addLanguage();
									}}
									fluid
								>
									Add
								</Button>
							</Grid.Column>
							<Grid.Column>
								<Button
									color={"grey"}
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
						<Grid.Row>
							<Grid.Column>
								<Message
									negative
									hidden={!this.state.schema.language}
								>
									Please enter both language and language
									level. Max string length is 80 characters.
								</Message>
							</Grid.Column>
						</Grid.Row>
					</React.Fragment>
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
