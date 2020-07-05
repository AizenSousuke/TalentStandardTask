import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import TalentCard from "../TalentFeed/TalentCard.jsx";
import { Loader, Grid } from "semantic-ui-react";
import CompanyProfile from "../TalentFeed/CompanyProfile.jsx";
import FollowingSuggestion from "../TalentFeed/FollowingSuggestion.jsx";
import { BodyWrapper, loaderData } from "../Layout/BodyWrapper.jsx";

export default class TalentFeed extends React.Component {
	constructor(props) {
		super(props);

		let loader = loaderData;
		loader.allowedUsers.push("Employer");
		loader.allowedUsers.push("Recruiter");

		this.state = {
			loadNumber: 5,
			loadPosition: 0,
			feedData: [],
			watchlist: [],
			loaderData: loader,
			loadingFeedData: false,
			companyDetails: null,
		};

		this.init = this.init.bind(this);
	}

	init() {
		let loaderData = TalentUtil.deepCopy(this.state.loaderData);
		loaderData.isLoading = false;
		this.setState({ loaderData }); //comment this
	}

	componentDidMount() {
		//window.addEventListener('scroll', this.handleScroll);
		this.init();
	}

	render() {
		return (
			<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
				<div className="ui container">
					<Grid>
						<Grid.Row>
							<Grid.Column width={"3"}>
								<CompanyProfile
									companyDetails={this.state.companyDetails}
								/>
							</Grid.Column>
							<Grid.Column width={"10"} textAlign={"center"}>
                                There are no talents
								<TalentCard />
                            </Grid.Column>
							<Grid.Column width={"3"}>
                                <FollowingSuggestion />
                            </Grid.Column>
						</Grid.Row>
					</Grid>
				</div>
			</BodyWrapper>
		);
	}
}
