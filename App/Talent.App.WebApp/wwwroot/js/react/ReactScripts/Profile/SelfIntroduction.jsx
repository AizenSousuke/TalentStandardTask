/* Self introduction section */
import React, { Component } from "react";
import Cookies from "js-cookie";
import { Input, Button, TextArea, Form, Grid } from "semantic-ui-react";
import Joi from "@hapi/joi";

export default class SelfIntroduction extends React.Component {
	constructor(props) {
		super(props);

		this.schema = Joi.object({
			summary: Joi.string().max(150),
			description: Joi.string().min(150).max(600),
		});

		this.state = {
			characters: 0,
			// For validation
			schema: {},
		};
		this.update = this.update.bind(this);
	}

	update(event) {
		// let data = Object.assign({}, this.state.schema);
		let data = {};
		data[event.target.name] = event.target.value;
		this.props.updateWithoutSave(data);

		if (event.target.name === "description") {
			let description = event.target.value;
			this.setState({
				characters: description.length,
			});
		}

		let dataname = event.target.name;
		let datavalue = event.target.value;
		const validation = this.checkStateForValidation({
			[dataname]: datavalue,
		});
		let schemadata = Object.assign({}, this.state.schema);
		console.log(validation, schemadata);
		schemadata[dataname] = !validation;
		this.setState({ schema: schemadata });
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
		const characterLimit = 600;
		let characters = this.props.description
			? this.props.description.length
			: 0;

		return (
			<Grid container>
				<Grid.Row>
					<Grid.Column>
						<Input
							name="summary"
							value={this.props.summary || ""}
							onChange={this.update}
							fluid
							placeholder={
								"Please provide a short summary about yourself"
							}
							error={this.state.schema.summary}
						/>
						<p>Summary must be no more than 150 characters.</p>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<TextArea
							maxLength={characterLimit}
							name="description"
							placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add."
							value={this.props.description || ""}
							fluid
							onChange={this.update}
							// error={this.state.schema.description}
						/>
						<p>
							Description must be between 150-600 characters.{" "}
							<br></br>
							Characters : {characters} / {characterLimit}
						</p>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column>
						<Button
							style={{ float: "right" }}
							color={"black"}
							onClick={(e) => {
								e.preventDefault();
								var data = Object.assign(
									{},
									{
										summary: this.props.summary,
										description: this.props.description,
									}
								);
								if (this.checkStateForValidation(data)) {
									this.props.updateProfileData(data);
								} else {
									TalentUtil.notification.show(
										"Summary and description did not update successfully",
										"error",
										null,
										null
									);
								}
							}}
							// disabled={this.checkStateForValidation({summary: this.props.summary, description: this.props.description})}
						>
							Save
						</Button>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
