import React from "react";
import ReactDOM from "react-dom";
import ReactPlayer from "react-player";
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

export default class TalentCardDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		switch (this.props.state) {
			case "profile":
				return (
					<React.Fragment>
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
					</React.Fragment>
				);
                default:
                    return (<React.Fragment>
                        <Grid>
                            <Grid.Column>
                                Video
                            </Grid.Column>
                        </Grid>
                    </React.Fragment>);

		}
	}
}
