import React from "react";
import { Loader, Card, Icon, Image } from "semantic-ui-react";

export default class CompanyProfile extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<React.Fragment>
				<Card>
					<Card.Content>
						<Card.Header textAlign={"center"}>
							<Image
                                circular
                                size={"mini"}
								src="http://loremflickr.com/100/100/image"
							/>
							<p>MVP Studio</p>
						</Card.Header>
                        <Card.Meta textAlign={"center"}>
                            <Icon name="map marker alternate" />
                            Address
                        </Card.Meta>
                        <Card.Description textAlign={"center"}>
                            Desired skills
                        </Card.Description>
					</Card.Content>
					<Card.Content extra>
						<div>
							<Icon name="call" />: 1234 5678
						</div>
						<div>
							<Icon name="mail" />: mvp@studio.com
						</div>
					</Card.Content>
				</Card>
			</React.Fragment>
		);
	}
}
