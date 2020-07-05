import React from "react";
import ReactPlayer from "react-player";
import PropTypes from "prop-types";
import {
	Popup,
	Icon,
	Card,
	Image,
	Grid,
	Container,
	Button,
	Divider,
	Label,
} from "semantic-ui-react";
import TalentCardDetail from "./TalentCardDetail.jsx";

export default class TalentCard extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			state: "video",
		};
	}

	handleState(e) {
		console.log(e.target.name);
		switch (e.target.name) {
			case "profile":
				this.setState({ state: "profile" });
				break;
			default:
				this.setState({ state: "video" });
				break;
		}
	}

	render() {
		return (
			<React.Fragment>
				<Card fluid>
					<Card.Content>
						<Grid>
							<Grid.Row>
								<Grid.Column width={"14"}>
									<Card.Header textAlign={"left"}>
										<h2>{this.props.talent.name}</h2>
									</Card.Header>
								</Grid.Column>
								<Grid.Column width={"2"}>
									<Icon name="star" size="big" />
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Card.Content>

					{/* Details here */}
					<TalentCardDetail
						talent={this.props.talent}
						state={this.state.state}
					/>

					<Card.Content extra>
						<Button.Group basic size={"medium"} widths={"4"}>
							{this.state.state === "video" ? (
								<Button
									name="profile"
									icon="male"
									onClick={(e) => {
										this.handleState(e);
									}}
								/>
							) : (
								<Button
									name="video"
									icon="video"
									onClick={(e) => {
										this.handleState(e);
									}}
								/>
							)}

							<Button
								name="cv"
								icon="file pdf outline"
								onClick={(e) => {
									console.log(e);
									window.location.href =
										this.props.talent.cvUrl === null
											? "https://google.com"
											: this.props.talent.cvUrl;
								}}
							/>
							<Button name="linkedin" icon="linkedin" />
							<Button name="github" icon="github" />
						</Button.Group>
						{/* <Grid columns={"equal"}>
							<Grid.Column></Grid.Column>
							<Grid.Column></Grid.Column>
							<Grid.Column></Grid.Column> 
							<Grid.Column></Grid.Column>
						</Grid> */}
					</Card.Content>
					<Card.Content extra textAlign={"left"}>
						{this.props.talent.skills !== null ? (
							this.props.talent.skills.map((skills, key) => {
								return (
									<Label key={key} basic color={"blue"}>
										{skills}
									</Label>
								);
							})
						) : (
							<React.Fragment></React.Fragment>
						)}
					</Card.Content>
				</Card>
			</React.Fragment>
		);
	}
}
