import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import TalentCard from "../TalentFeed/TalentCard.jsx";
import { Loader, Grid } from "semantic-ui-react";
import CompanyProfile from "../TalentFeed/CompanyProfile.jsx";
import FollowingSuggestion from "../TalentFeed/FollowingSuggestion.jsx";
import { BodyWrapper, loaderData } from "../Layout/BodyWrapper.jsx";
import InfiniteScroll from "react-infinite-scroller";

export default class TalentFeed extends React.Component {
	constructor(props) {
		super(props);

		let loader = loaderData;
		loader.allowedUsers.push("Employer");
		loader.allowedUsers.push("Recruiter");

		this.state = {
			// Number of objects to load per page
			loadNumber: 5,
			// Initial load page
			loadPosition: 0,
			feedData: [],
			watchlist: [],
			loaderData: loader,
			loadingFeedData: false,
			companyDetails: null,
			// Limits
			position: 0,
			number: 5,
			// Has more
			hasMore: true,
		};

		this.init = this.init.bind(this);
	}

	init() {
		let loaderData = TalentUtil.deepCopy(this.state.loaderData);
		loaderData.isLoading = false;
		this.setState({ loaderData }); //comment this
	}

	componentWillMount() {
		// Fetch initial data
		var cookies = Cookies.get("talentAuthToken");
		// $.ajax({
		// 	url:
		// 		"https://talentservicesprofilenik.azurewebsites.net/profile/profile/getTalent" +
		// 		"?position=" +
		// 		this.state.position +
		// 		"&number=" +
		// 		this.state.number,
		// 	headers: {
		// 		Authorization: "Bearer " + cookies,
		// 		"Content-Type": "application/json",
		// 	},
		// 	type: "GET",
		// 	success: function (res) {
		// 		this.setState({ feedData: res.data }, () => {
		// 			// console.log(this.state.feedData.length);

		// 			// Set variables for the next load
		// 			this.setState({ position: this.state.position + 1 });
		// 		});
		// 	}.bind(this),
		// });

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

	loadMore() {
		if (!this.state.loadingFeedData) {
			this.setState({ loadingFeedData: true }, () => {
				// console.log("Loading more data");
				// Copy previous data and add new data later on
				var data = this.state.feedData;
				// console.log("Current Feed Data: ", data);

				// Fetch data
				var cookies = Cookies.get("talentAuthToken");
				$.ajax({
					url:
						// "https://talentservicesprofilenik.azurewebsites.net/profile/profile/getTalent" +
						"http://localhost:60290/profile/profile/getTalent" +
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
						// Add additional data to the feed if there is existing data
						// console.log("Res Data: ", res.data);
						res.data.map(t => {
							data.push(t);
						})
						// console.log("New Feed Data: ", data);

						this.setState({ feedData: data }, () => {
							// console.log(this.state.feedData.length);

							// Set variables for the next load
							this.setState({
								position: this.state.position + this.state.number,
								loadingFeedData: false
							});
						});
					}.bind(this),
				});
			});
		}
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
								{/* {this.state.feedData === [] && this.state.feedData !== undefined ? (
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
								)} */}

								<InfiniteScroll
									pageStart={this.state.position}
									loadMore={() => this.loadMore()}
									hasMore={this.state.hasMore}
									loader={
										<div className="loader" key={0}>
											Loading ...
										</div>
									}
								>
									{this.state.feedData === [] &&
									this.state.feedData !== undefined ? (
										<b>
											There are no talents found for your
											recruitment company.
										</b>
									) : (
										<React.Fragment>
											{this.state.feedData.length > 0
												? this.state.feedData.map(
														(talent) => {
															return (
																<TalentCard
																	key={
																		talent.id
																	}
																	talent={
																		talent
																	}
																/>
															);
														}
												  )
												: "Error: Cannot map data"}
										</React.Fragment>
									)}
								</InfiniteScroll>
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
