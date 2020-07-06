/* Social media JSX */
import React from "react";
import { ChildSingleInput } from "../Form/SingleInput.jsx";
import { Popup } from "semantic-ui-react";
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
import Joi, { link } from "@hapi/joi";

export default class SocialMediaLinkedAccount extends React.Component {
	constructor(props) {
		super(props);

		this.schema = Joi.object({
			LinkedIn: Joi.string().max(80),
			Github: Joi.string().max(80),
		});

		this.state = {
			LinkedIn: "",
			Github: "",
			openEdit: false,
			// For validation
			schema: {},
		};
	}

	componentDidMount() {
		$(".ui.button.social-media").popup();
	}

	openEdit(event = null, LinkedIn = null, Github = null) {
		// Set the values in the edit if used from the edit button
		this.setState(
			{
				openEdit: !this.state.openEdit,
				LinkedIn: this.props.linkedAccounts.linkedin,
				Github: this.props.linkedAccounts.github,
			},
			() => {
				// console.log("Open Edit: ", this.state.openEdit);
			}
		);
	}

	update(event) {
		let dataname = event.target.name;
		let datavalue = event.target.value;
		const validation = this.checkStateForValidation({
			[dataname]: datavalue,
		});
		let schemadata = Object.assign({}, this.state.schema);
		console.log(validation, schemadata);
		schemadata[dataname] = !validation;
		this.setState({ schema: schemadata });

		let data = {};
		data[event.target.name] = event.target.value;
		this.setState(data, () => {
			let linkedAccounts = Object.assign(
				{},
				{
					linkedAccounts: {
						linkedin: this.state.LinkedIn,
						github: this.state.Github,
					},
				}
			);
			this.props.updateProfileData(linkedAccounts);
		});
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

	render() {
		return (
			<Grid container columns="equal">
				<Grid.Row>
					{this.state.openEdit === false ? (
						<React.Fragment>
							<Grid.Column>
								<Button
									color={"linkedin"}
									onClick={(e) => {
										e.preventDefault();
										window.location.href = this.props.linkedAccounts.linkedIn;
									}}
								>
									<Icon name="linkedin" />
									LinkedIn
								</Button>
								<Button
									color={"black"}
									onClick={(e) => {
										e.preventDefault();
										window.location.href = this.props.linkedAccounts.github;
									}}
								>
									<Icon name="github" />
									Github
								</Button>
							</Grid.Column>
							<Grid.Column>
								<Button
									floated={"right"}
									color={"black"}
									onClick={(e) => {
										e.preventDefault();
										this.openEdit();
									}}
								>
									Edit
								</Button>
							</Grid.Column>
						</React.Fragment>
					) : (
						<Grid.Column>
							<Grid.Row>
								<b>LinkedIn</b>
								<Input
									name="LinkedIn"
									type="text"
									fluid
									onChange={(e) => this.update(e)}
									placeholder="Enter your LinkedIn URL"
									value={this.props.linkedAccounts.linkedIn}
									error={this.state.schema.LinkedIn}
								/>
								<br></br>
							</Grid.Row>
							<Grid.Row>
								<b>Github</b>
								<Input
									name="Github"
									type="text"
									fluid
									onChange={(e) => this.update(e)}
									placeholder="Enter your Github URL"
									value={this.props.linkedAccounts.github}
									error={this.state.schema.Github}
								/>
								<br></br>
							</Grid.Row>
							<Grid.Row>
								<Button
									color={"black"}
									onClick={(e) => {
										e.preventDefault();
										let checkschema = Object.assign(
											{},
											{
												LinkedIn: this.state.LinkedIn,
												Github: this.state.Github,
											}
										);
										let data = Object.assign(
											{},
											{
												linkedAccounts: {
													linkedin: this.state
														.LinkedIn,
													github: this.state.Github,
												},
											}
										);
										if (
											this.checkStateForValidation(checkschema)
										) {
											this.props.saveProfileData(data);
											this.openEdit();
										} else {
											TalentUtil.notification.show(
												"Linked Accounts data did not update successfully",
												"error",
												null,
												null
											);
										}
									}}
								>
									Save
								</Button>
								<Button
									onClick={(e) => {
										e.preventDefault();
										this.openEdit();
									}}
								>
									Cancel
								</Button>
							</Grid.Row>
						</Grid.Column>
					)}
				</Grid.Row>
			</Grid>
		);
	}
}
