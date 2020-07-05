import React from "react";
import { Loader, Card, Icon, Image } from "semantic-ui-react";

export default class CompanyProfile extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.companyDetails !== null) {
			return (
				<React.Fragment>
					<Card>
						<Card.Content>
							<Card.Header textAlign={"center"}>
								<Image
									circular
									size={"mini"}
									src={
										this.props.companyDetails
											.profilePhotoUrl !== null
											? this.props.companyDetails
													.profilePhotoUrl
											: "http://loremflickr.com/100/100/image"
									}
								/>
								<p>
									{
										this.props.companyDetails.companyContact
											.name
									}
								</p>
							</Card.Header>
							<Card.Meta textAlign={"center"}>
								<Icon name="map marker alternate" />
								{
									this.props.companyDetails.companyContact
										.location.city
								}
								,{" "}
								{
									this.props.companyDetails.companyContact
										.location.country
								}
							</Card.Meta>
							<Card.Description textAlign={"center"}>
								We currently do not have specific skills that we
								desire.
							</Card.Description>
						</Card.Content>
						<Card.Content extra>
							<div>
								<Icon name="call" />:{" "}
								{this.props.companyDetails.companyContact.phone}
							</div>
							<div>
								<Icon name="mail" />:{" "}
								{this.props.companyDetails.companyContact.email}
							</div>
						</Card.Content>
					</Card>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>Failed to load company details.</React.Fragment>
			);
		}
	}
}
