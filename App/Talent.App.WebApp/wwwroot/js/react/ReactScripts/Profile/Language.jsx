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
				text: "Conversational",
				value: "Conversational",
			},
			{
				key: "2",
				text: "Fluent",
				value: "Fluent",
			},
			{
				key: "3",
				text: "Native/Bilingual",
				value: "Native/Bilingual",
			},
		];

		this.schema = Joi.object({
			language: Joi.string().max(80),
			languageLevel: Joi.string().max(80),
		});

		this.state = {
			languagesArray: [],
			openAdd: false,
			openEdit: false,
			// Only open the one that is the same as this
			openEditId: null,
			language: "",
			languageLevel: "",
			options: options,
			// For validation
			schema: {},
		};
	}

	componentWillMount() {
		this.getLanguage();
	}

	handleChange(event, name = null, value = null) {
		// console.log(event.target.name, event.target.value, name, value);
		const data = Object.assign({}, this.state.schema);
		let dataname = "";
		switch (event.target.name) {
			case undefined:
				dataname = name;
				this.setState({ [name]: value }, () => {
					// console.log(this.state.languageLevel);
					const validation = this.checkStateForValidation({
						languageLevel: this.state.languageLevel,
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
						// console.log(this.state.language);
						const validation = this.checkStateForValidation({
							language: this.state.language,
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

	openAdd(event = null) {
		if (this.openAdd) {
			// Clear inputs
			this.setState({ language: "", languageLevel: "" });
		}
		this.setState({ openAdd: !this.state.openAdd, openEdit: false }, () => {
			// console.log("Open Add: ", this.state.openAdd);
		});
	}

	openEdit(event = null, id = null, name = null, level = null) {
		// Set the values in the edit if used from the edit button
		this.setState(
			{
				openEdit: !this.state.openEdit,
				openAdd: false,
				openEditId: id,
				language: name,
				languageLevel: level,
			},
			() => {
				// console.log("Open Edit: ", this.state.openEdit);
			}
		);
	}

	getLanguage() {
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/getLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
				// console.log("getLanguage: ", res);
				if (res.success == true) {
					this.setState({ languagesArray: res.data }, () => {
						// Update the languages data in profile
						// const obj = Object.assign({}, { languages: this.state.languagesArray });
						// this.props.updateAndSaveData(obj);
					});
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
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
			// Should add on to languages
			const data = Object.assign(
				{},
				{
					currentUserId: this.props.userId,
					name: this.state.language,
					level: this.state.languageLevel,
				}
			);
			this.addingLanguage(data);
			this.openAdd();
		} else {
			// Set warning
			this.setState({ schema: { language: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	addingLanguage(language) {
		var AddLanguageViewModel = Object.assign({}, language);
		console.log("AddLanguageViewModel: ", AddLanguageViewModel);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/addLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(AddLanguageViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getLanguage();
					TalentUtil.notification.show(
						"Language updated successfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Language did not update successfully",
						"error",
						null,
						null
					);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	editLanguage(id = null) {
		console.log("Edit language");
		// Validate first
		if (
			this.checkStateForValidation({
				language: this.state.language,
				languageLevel: this.state.languageLevel,
			})
		) {
			console.log("Editing language");
			// Should add on to languages
			const data = Object.assign(
				{},
				{
					currentUserId: this.props.userId,
					id: id,
					name: this.state.language,
					level: this.state.languageLevel,
				}
			);
			this.updateLanguage(data);
			this.openEdit();
		} else {
			// Set warning
			this.setState({ schema: { language: true } });
			TalentUtil.notification.show(
				"Please check and resolve the errors",
				"error",
				null,
				null
			);
		}
	}

	updateLanguage(language) {
		var AddLanguageViewModel = Object.assign({}, language);
		console.log("AddLanguageViewModel: ", AddLanguageViewModel);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(AddLanguageViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getLanguage();
					TalentUtil.notification.show(
						"Language updated successfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Language did not update successfully",
						"error",
						null,
						null
					);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	deleteLanguage(language) {
		console.log("Deleting ", language);
		var DeleteLanguageViewModel = Object.assign({}, language);
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url: "https://talentservicesprofilenik.azurewebsites.net/profile/profile/deleteLanguage",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "POST",
			data: JSON.stringify(DeleteLanguageViewModel),
			success: function (res) {
				console.log(res);
				if (res.success == true) {
					this.getLanguage();
					TalentUtil.notification.show(
						"Language deleted successfully",
						"success",
						null,
						null
					);
				} else {
					TalentUtil.notification.show(
						"Language did not delete successfully",
						"error",
						null,
						null
					);
				}
			}.bind(this),
			error: function (res, a, b) {
				console.log(res);
				console.log(a);
				console.log(b);
			},
		});
	}

	render() {
		return (
			<Grid container columns="equal">
				{this.state.openAdd && (
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
									color={"teal"}
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
									fluid
									onClick={(e) => {
										e.preventDefault();
										this.openAdd();
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
										color={"teal"}
										fluid
										onClick={(e) => {
											e.preventDefault();
											this.openAdd();
										}}
									>
										<Icon name={"plus"} />
										Add New
									</Button>
								</TableHeaderCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{this.state.languagesArray.map((l) => {
								return (
									<React.Fragment key={l.id}>
										{this.state.openEdit &&
										this.state.openEditId == l.id ? (
											<TableRow>
												<TableCell width={6}>
													<Input
														name="language"
														type="text"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit language"
														value={
															this.state.language
																? this.state
																		.language
																: ""
														}
														error={
															this.state.schema
																.language
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.language
														}
													>
														Please enter both
														language and language
														level. Max string length
														is 80 characters.
													</Message>
												</TableCell>
												<TableCell width={6}>
													<Select
														name="languageLevel"
														placeholder={
															"Edit Language Level"
														}
														value={
															this.state
																.languageLevel
														}
														options={
															this.state.options
														}
														onChange={(
															e,
															{ name, value }
														) => {
															e.preventDefault();
															this.handleChange(
																e,
																name,
																value
															);
														}}
														fluid
													/>
												</TableCell>
												<TableCell textAlign={"right"}>
													<Button
														basic
														primary
														onClick={(e) => {
															e.preventDefault();
															this.editLanguage(
																l.id
															);
														}}
														disabled={this.props.disableButtons}
													>
														Update
													</Button>
													<Button
														basic
														negative
														onClick={(e) => {
															e.preventDefault();
															this.openEdit(e);
														}}
													>
														Cancel
													</Button>
												</TableCell>
											</TableRow>
										) : (
											<TableRow>
												<TableCell width={6}>
													{l.name}
												</TableCell>
												<TableCell width={6}>
													{l.level}
												</TableCell>
												<TableCell textAlign={"right"}>
													<Button
														basic
														icon="edit"
														size="mini"
														onClick={(e) => {
															e.preventDefault();
															this.openEdit(
																e,
																l.id,
																l.name,
																l.level
															);
														}}
														disabled={this.props.disableButtons}
													></Button>
													<Button
														basic
														icon="close"
														size="mini"
														onClick={(e) => {
															e.preventDefault();
															this.deleteLanguage(
																l
															);
														}}
														disabled={this.props.disableButtons}
													></Button>
												</TableCell>
											</TableRow>
										)}
									</React.Fragment>
								);
							})}
						</TableBody>
					</Table>
				</Grid.Row>
			</Grid>
		);
	}
}
