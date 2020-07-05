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
import YouTube from "react-youtube";

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
									src={this.props.talent.photoId !== null ? this.props.talent.photoId : "http://semantic-ui.com/images/avatar/large/jenny.jpg"}
								/>
							</Grid.Column>
							<Grid.Column textAlign={"left"}>
								<Grid.Row>
									<h3>Talent Snapshot</h3>
									<br></br>
								</Grid.Row>
								<Grid.Row>
									<b>CURRENT EMPLOYER</b>
									<p>{this.props.talent.currentEmployment}</p>
									<br></br>
								</Grid.Row>
								<Grid.Row>
									<b>VISA STATUS</b>
									<p>{this.props.talent.visa}</p>
									<br></br>
								</Grid.Row>
								<Grid.Row>
									<b>POSITION</b>
									<p>{this.props.talent.summary}</p>
									<br></br>
								</Grid.Row>
							</Grid.Column>
						</Grid>
					</React.Fragment>
				);
			default:
				return (
					<React.Fragment>
						<Grid>
							<Grid.Column>
								{/* <iframe width="560" height="315" src={this.props.talent.videoUrl} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
								<YouTube videoId={this.props.talent.videoUrl == null ? "iOHdxnEnOyo" : this.props.talent.videoUrl.split("v=")[1]} />
							</Grid.Column>
						</Grid>
					</React.Fragment>
				);
		}
	}
}
