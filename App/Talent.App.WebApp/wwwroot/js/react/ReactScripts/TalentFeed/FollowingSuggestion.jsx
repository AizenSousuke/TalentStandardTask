import React from "react";
import { Card, Feed } from "semantic-ui-react";

export default class FollowingSuggestion extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Card>
					<Card.Content>
						<Card.Header>Follow Talent</Card.Header>
						<Feed>
							<Feed.Event>
								<Feed.Label image="http://semantic-ui.com/images/avatar/small/jenny.jpg" />
								<Feed.Content>
									<Feed.Summary>
										<a className="">Veronika Ossi</a>
										<button className="ui primary basic button">
											<i className="icon user"></i>Follow
										</button>
									</Feed.Summary>
								</Feed.Content>
							</Feed.Event>
						</Feed>
					</Card.Content>
				</Card>
			</React.Fragment>
		);
	}
}
