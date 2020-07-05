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

export default class TalentCard extends React.Component {
	constructor(props) {
		super(props);
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
					<Grid columns={"equal"}>
						<Grid.Column>
							<Image
								fluid
								src="http://semantic-ui.com/images/avatar/large/jenny.jpg"
							/>
						</Grid.Column>
						<Grid.Column textAlign={"left"}>
							<Grid.Row>
								<h3>Talent Snapshot</h3>
								<br></br>
							</Grid.Row>
							<Grid.Row>
								<b>CURRENT EMPLOYER</b>
								<p>ABC</p>
								<br></br>
							</Grid.Row>
							<Grid.Row>
								<b>VISA STATUS</b>
								<p>ABC</p>
								<br></br>
							</Grid.Row>
							<Grid.Row>
								<b>POSITION</b>
								<p>ABC</p>
								<br></br>
							</Grid.Row>
						</Grid.Column>
					</Grid>
					<Card.Content extra>
						<Button.Group basic size={"medium"} widths={"4"}>
							<Button icon="video" />
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
