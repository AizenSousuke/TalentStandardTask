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
			state: "",
		};
	}

	handleState(e) {
        console.log(e);
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
										<h2>Header</h2>
									</Card.Header>
								</Grid.Column>
								<Grid.Column width={"2"}>
									<Icon name="star" size="big" />
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Card.Content>
					<TalentCardDetail state={this.state.state} />
					<Card.Content extra>
						<Button.Group basic size={"medium"} widths={"4"}>
							<Button
								icon="video"
								onClick={(e) => {
									this.handleState(e);
								}}
							/>
							<Button icon="file pdf outline" />
							<Button icon="linkedin" />
							<Button icon="github" />
						</Button.Group>
						{/* <Grid columns={"equal"}>
							<Grid.Column></Grid.Column>
							<Grid.Column></Grid.Column>
							<Grid.Column></Grid.Column> 
							<Grid.Column></Grid.Column>
						</Grid> */}
					</Card.Content>
					<Card.Content extra textAlign={"left"}>
						<Label basic color={"blue"}>
							C#
						</Label>
					</Card.Content>
				</Card>
			</React.Fragment>
		);
	}
}
