/* Language section */
import React from "react";
import Cookies from "js-cookie";
import { Dropdown, Grid } from "semantic-ui-react";
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

	render() {
		return (
			// <div className="ui sixteen wide column">
			<Grid container columns="equal">
				<Grid.Row>
					<Grid.Column>
						<ChildSingleInput
							inputType="text"
							name="addlanguage"
							value={
								this.state.language ? this.state.language : ""
							}
							controlFunc={(e) => this.handleChange(e)}
							maxLength={80}
							isError={this.state.schema.language}
							placeholder="Add language"
							errorMessage="Please enter a valid language"
						/>
					</Grid.Column>
					<Grid.Column>
						<Dropdown
							placeholder={"Language Level"}
							options={this.state.options}
							// fluid
						/>
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<button
						type="button"
						className="ui teal button"
						onClick={this.saveContact}
					>
						Save
					</button>
					<button
						type="button"
						className="ui button"
						onClick={this.closeEdit}
					>
						Cancel
					</button>
				</Grid.Row>
			</Grid>
			// </div>
		);
	}
}
