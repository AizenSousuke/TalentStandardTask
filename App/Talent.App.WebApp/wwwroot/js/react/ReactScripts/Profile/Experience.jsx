/* Experience section */
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

export default class Experience extends React.Component {
	constructor(props) {
		super(props);

		this.schema = Joi.object({
			company: Joi.string().max(80),
			position: Joi.string().max(80),
			responsibilities: Joi.string().max(80),
			startdate: Joi.date(),
			enddate: Joi.date(),
		});

		this.state = {
			workexperiencesArray: [],
			openAdd: false,
			openEdit: false,
			// Only open the one that is the same as this
			openEditId: null,
			company: "",
			position: "",
			responsibilities: "",
			startdate: "",
			enddate: "",
			// For validation
			schema: {},
		};
    }
    handleChange(event, name = null, value = null) {
		console.log(event.target.name, event.target.value, name, value);
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
			this.setState({ company: "", position: "", responsibilities: "", startdate: "", enddate: "" });
		}
		this.setState({ openAdd: !this.state.openAdd, openEdit: false }, () => {
			// console.log("Open Add: ", this.state.openAdd);
		});
    }
    
	openEdit(event = null, id = null, company = null, position = null, responsibilities = null) {
		// Set the values in the edit if used from the edit button
		this.setState(
			{
				openEdit: !this.state.openEdit,
				openAdd: false,
				openEditId: id,
				company: company,
				position: position,
                responsibilities: responsibilities,
                startdate: "",
                enddate: "",
			},
			() => {
				// console.log("Open Edit: ", this.state.openEdit);
			}
		);
	}

	render() {
		return (
			<Grid container columns="equal">
				{this.state.openAdd && (
					<React.Fragment>
						<Grid.Row>
							<Grid.Column>
								Company:
								<Input
									name="company"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add company"
									value={
										this.state.company
											? this.state.company
											: ""
									}
									error={this.state.schema.company}
								/>
							</Grid.Column>
							<Grid.Column>
								Position:
								<Input
									name="position"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add position"
									value={
										this.state.position
											? this.state.position
											: ""
									}
									error={this.state.schema.position}
								/>
							</Grid.Column>
							{/* <Grid.Column>
								<Select
									name="workexperienceLevel"									placeholder={"Work Experience Level"}
									value={this.state.workexperienceLevel}
									options={this.state.options}
									onChange={(e, { name, value }) => {
										e.preventDefault();
										this.handleChange(e, name, value);
									}}
									fluid
								/>
							</Grid.Column> */}
						</Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                Start Date:
                                <Input 
                                    name="startdate"
                                    type="date"
                                    fluid
                                    value={this.state.startdate ? this.state.startdate : ""}
									error={this.state.schema.startdate}
									onChange={(e) => this.handleChange(e)}
                                />
                            </Grid.Column>
                            <Grid.Column>
                                End Date:
                                <Input 
                                    name="enddate"
                                    type="date"
                                    fluid
                                    value={this.state.enddate ? this.state.enddate : ""}
									onChange={(e) => this.handleChange(e)}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
							<Grid.Column>
								Responsibilities:
								<Input
									name="responsibilities"
									type="text"
									fluid
									onChange={(e) => this.handleChange(e)}
									placeholder="Add responsibilities"
									value={
										this.state.responsibilities
											? this.state.responsibilities
											: ""
									}
									error={this.state.schema.responsibilities}
								/>
							</Grid.Column>
                        </Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Message
									negative
									hidden={!this.state.schema.workexperience}
								>
									Please enter both work experience and work
									experience level. Max string length is 80
									characters.
								</Message>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Button
									color={"green"}
									onClick={(e) => {
										e.preventDefault();
										this.addWorkExperience();
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
										this.openAdd();
									}}
								>
									Cancel
								</Button>
							</Grid.Column>
						</Grid.Row>
					</React.Fragment>
				)}

				<Grid.Row>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHeaderCell>
									Company
								</TableHeaderCell>
								<TableHeaderCell>
									Position
								</TableHeaderCell>
								<TableHeaderCell>
									Responsibilities
								</TableHeaderCell>
								<TableHeaderCell>
									Start
								</TableHeaderCell>
								<TableHeaderCell>
									End
								</TableHeaderCell>
								<TableHeaderCell>
									<Button
										color={"black"}
										fluid
										onClick={(e) => {
											e.preventDefault();
											this.openAdd();
										}}
									>
										Add New
									</Button>
								</TableHeaderCell>
							</TableRow>
						</TableHeader>
						<TableBody>
							{this.state.workexperiencesArray.map((l) => {
								return (
									<React.Fragment key={l.id}>
										{this.state.openEdit &&
										this.state.openEditId == l.id ? (
											<TableRow>
												<TableCell>
													Company:
													<Input
														name="company"
														type="text"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit company"
														value={
															this.state.company
																? this.state
																		.company
																: ""
														}
														error={
															this.state.schema
																.company
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.company
														}
													>
														Please fill up all the
														fields. Max string
														length is 80 characters.
													</Message>
												</TableCell>
												<TableCell>
													Position:
													<Input
														name="position"
														type="text"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit position"
														value={
															this.state.position
																? this.state
																		.position
																: ""
														}
														error={
															this.state.schema
																.position
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.position
														}
													>
														Please fill up all the
														fields. Max string
														length is 80 characters.
													</Message>
												</TableCell>
												<TableCell>
													Responsibilities:
													<Input
														name="responsibilities"
														type="text"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit responsibilities"
														value={
															this.state
																.responsibilities
																? this.state
																		.responsibilities
																: ""
														}
														error={
															this.state.schema
																.responsibilities
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.responsibilities
														}
													>
														Please fill up all the
														fields. Max string
														length is 80 characters.
													</Message>
												</TableCell>
												<TableCell>
													Start Date:
													<Input
														name="startdate"
														type="date"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit startdate"
														value={
															this.state
																.startdate
																? this.state
																		.startdate
																: ""
														}
														error={
															this.state.schema
																.startdate
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.startdate
														}
													>
														Please fill up all the
														fields. Max string
														length is 80 characters.
													</Message>
												</TableCell>
												<TableCell>
													Start Date:
													<Input
														name="enddate"
														type="date"
														fluid
														onChange={(e) =>
															this.handleChange(e)
														}
														placeholder="Edit enddate"
														value={
															this.state
																.enddate
																? this.state
																		.enddate
																: ""
														}
														error={
															this.state.schema
																.enddate
														}
													/>
													<Message
														negative
														hidden={
															!this.state.schema
																.enddate
														}
													>
														Please fill up all the
														fields. Max string
														length is 80 characters.
													</Message>
												</TableCell>
												<TableCell textAlign={"right"}>
													<Button
														basic
														primary
														onClick={(e) => {
															e.preventDefault();
															this.editWorkExperience(
																l.id
															);
														}}
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
												<TableCell>
													{l.company}
												</TableCell>
												<TableCell>
													{l.position}
												</TableCell>
												<TableCell>
													{l.responsibilities}
												</TableCell>
												<TableCell>
													{l.startdate}
												</TableCell>
												<TableCell>
													{l.enddate}
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
													></Button>
													<Button
														basic
														icon="close"
														size="mini"
														onClick={(e) => {
															e.preventDefault();
															this.deleteWorkExperience(
																l
															);
														}}
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
