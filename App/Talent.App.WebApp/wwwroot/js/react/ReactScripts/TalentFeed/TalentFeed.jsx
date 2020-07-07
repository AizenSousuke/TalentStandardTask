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
			// Limits
			position: 1,
			number: 5,
		};

		this.init = this.init.bind(this);
	}

	init() {
		let loaderData = TalentUtil.deepCopy(this.state.loaderData);
		loaderData.isLoading = false;
		this.setState({ loaderData }); //comment this
	}

	componentWillMount() {
		// Fetch data
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url:
				"https://talentservicesprofilenik.azurewebsites.net/profile/profile/getTalent" +
				"?position=" +
				this.state.position +
				"&number=" +
				this.state.number,
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
				this.setState({ feedData: res.data }, () => {
					// console.log(this.state.feedData.length);
				});
			}.bind(this),
		});

		$.ajax({
			url:
				"https://talentservicesprofilenik.azurewebsites.net/profile/profile/getEmployerProfile",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
				this.setState({ companyDetails: res.employer }, () => {
					// console.log(this.state.feedData.length);
				});
			}.bind(this),
		});
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
								{this.state.feedData === [] && this.state.feedData !== undefined ? (
									<b>
										There are no talents found for your
										recruitment company.
									</b>
								) : (
									<React.Fragment>
										{this.state.feedData.length > 1
											? this.state.feedData.map(
													(talent) => {
														return (
															<TalentCard
																key={talent.id}
																talent={talent}
															/>
														);
													}
											  )
											: "Cannot map data"}
									</React.Fragment>
								)}
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
