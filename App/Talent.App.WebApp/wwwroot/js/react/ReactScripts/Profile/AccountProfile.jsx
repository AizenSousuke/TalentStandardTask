import React from "react";
import Cookies from "js-cookie";
import SocialMediaLinkedAccount from "./SocialMediaLinkedAccount.jsx";
import { IndividualDetailSection } from "./ContactDetail.jsx";
import FormItemWrapper from "../Form/FormItemWrapper.jsx";
import { Address, Nationality } from "./Location.jsx";
import Language from "./Language.jsx";
import Skill from "./Skill.jsx";
import Education from "./Education.jsx";
import Certificate from "./Certificate.jsx";
import VisaStatus from "./VisaStatus.jsx";
import PhotoUpload from "./PhotoUpload.jsx";
import VideoUpload from "./VideoUpload.jsx";
import CVUpload from "./CVUpload.jsx";
import SelfIntroduction from "./SelfIntroduction.jsx";
import Experience from "./Experience.jsx";
import { BodyWrapper, loaderData } from "../Layout/BodyWrapper.jsx";
import { LoggedInNavigation } from "../Layout/LoggedInNavigation.jsx";
import TalentStatus from "./TalentStatus.jsx";
import { lang } from "moment";

export default class AccountProfile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			disableButtons: false,
			profileData: {
				id: "",
				address: {},
				nationality: "",
				education: [],
				languages: [],
				skills: [],
				experience: [],
				certifications: [],
				visaStatus: "",
				visaExpiryDate: "",
				profilePhoto: "",
				linkedAccounts: {
					linkedIn: "",
					github: "",
				},
				jobSeekingStatus: {
					status: "",
					availableDate: null,
				},
			},
			loaderData: loaderData,
		};

		this.updateWithoutSave = this.updateWithoutSave.bind(this);
		this.updateAndSaveData = this.updateAndSaveData.bind(this);
		this.updateForComponentId = this.updateForComponentId.bind(this);
		this.saveProfile = this.saveProfile.bind(this);
		this.loadData = this.loadData.bind(this);
		this.init = this.init.bind(this);
	}

	init() {
		let loaderData = this.state.loaderData;
		loaderData.allowedUsers.push("Talent");
		loaderData.isLoading = false;
		this.setState({ loaderData });
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {
		console.log("Loading data in account profile");
		var cookies = Cookies.get("talentAuthToken");
		$.ajax({
			url:
				"https://talentservicesprofilenik.azurewebsites.net/profile/profile/getTalentProfile",
			headers: {
				Authorization: "Bearer " + cookies,
				"Content-Type": "application/json",
			},
			type: "GET",
			success: function (res) {
				this.updateWithoutSave(res.data);
			}.bind(this),
		});
		this.init();
	}

	//updates component's state without saving data
	updateWithoutSave(newValues) {
		console.log("Current profile data", this.state.profileData);
		console.log("Update without save data", newValues);
		let newProfile = Object.assign({}, this.state.profileData, newValues);
		this.setState({
			profileData: newProfile,
		});
	}

	//updates component's state and saves data
	updateAndSaveData(newValues) {
		console.log("Current profile data", this.state.profileData);
		console.log("Update and save data", newValues);
		let newProfile = Object.assign({}, this.state.profileData, newValues);
		this.setState(
			{
				profileData: newProfile,
			},
			this.saveProfile
		);
	}

	updateForComponentId(componentId, newValues) {
		this.updateAndSaveData(newValues);
	}

	saveProfile() {
		// Disable buttons
		this.setState({ disableButtons: true }, () => {
			var cookies = Cookies.get("talentAuthToken");
			$.ajax({
				url:
					"https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateTalentProfile",
				headers: {
					Authorization: "Bearer " + cookies,
					"Content-Type": "application/json",
				},
				type: "POST",
				data: JSON.stringify(this.state.profileData),
				success: function (res) {
					console.log(res);
					if (res.success == true) {
						TalentUtil.notification.show(
							"Profile updated successfully",
							"success",
							null,
							null
						);
					} else {
						TalentUtil.notification.show(
							"Profile did not update successfully",
							"error",
							null,
							null
						);
					}
					// Enable buttons
					this.setState({ disableButtons: false });
				}.bind(this),
				error: function (res, a, b) {
					console.log(res);
					console.log(a);
					console.log(b);
				},
			});
		});
	}

	render() {
		const profile = {
			firstName: this.state.profileData.firstName,
			lastName: this.state.profileData.lastName,
			email: this.state.profileData.email,
			phone: this.state.profileData.phone,
		};
		return (
			<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
				<section className="page-body">
					<div className="ui container">
						<div className="ui container">
							<div className="profile">
								<form className="ui form">
									<div className="ui grid">
										<FormItemWrapper
											title="Linked Accounts"
											tooltip="Linking to online social networks adds credibility to your profile"
										>
											<SocialMediaLinkedAccount
												disableButtons={this.state.disableButtons}
												linkedAccounts={
													this.state.profileData
														.linkedAccounts
												}
												updateProfileData={
													this.updateWithoutSave
												}
												saveProfileData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Description"
											tooltip="Write a description of your yourself."
											// hideSegment={true}
										>
											<SelfIntroduction
												disableButtons={this.state.disableButtons}
												summary={
													this.state.profileData
														.summary
												}
												description={
													this.state.profileData
														.description
												}
												updateProfileData={
													this.updateAndSaveData
												}
												updateWithoutSave={
													this.updateWithoutSave
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="User Details"
											tooltip="Enter your contact details"
										>
											<IndividualDetailSection
												disableButtons={this.state.disableButtons}
												controlFunc={
													this.updateForComponentId
												}
												details={profile}
												componentId="contactDetails"
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Address"
											tooltip="Enter your current address"
										>
											<Address
												disableButtons={this.state.disableButtons}
												addressData={
													this.state.profileData
														.address
												}
												updateProfileData={
													this.updateWithoutSave
												}
												saveProfileData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Nationality"
											tooltip="Select your nationality"
										>
											<Nationality
												disableButtons={this.state.disableButtons}
												nationalityData={
													this.state.profileData
														.nationality
												}
												saveProfileData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Languages"
											tooltip="Select languages that you speak"
										>
											<Language
												disableButtons={this.state.disableButtons}
												languageData={
													this.state.profileData
														.languages
												}
												userId={
													this.state.profileData.id
												}
												updateAndSaveData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Skills"
											tooltip="List your skills"
										>
											<Skill
												disableButtons={this.state.disableButtons}
												skillData={
													this.state.profileData
														.skills
												}
												userId={
													this.state.profileData.id
												}
												updateAndSaveData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Work experience"
											tooltip="Add your work experience"
										>
											<Experience
												disableButtons={this.state.disableButtons}
												userId={
													this.state.profileData.id
												}
												experienceData={
													this.state.profileData
														.experience
												}
												updateProfileData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										{/* <FormItemWrapper
                                            title='Education'
                                            tooltip='Add your educational background'
                                        >
                                            <Education
                                                educationData={this.state.profileData.education}
                                                updateProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Certification'
                                            tooltip='List your certificates, honors and awards'
                                        >
                                            <Certificate
                                                certificateData={this.state.profileData.certifications}
                                                updateProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper> */}
										<FormItemWrapper
											title="Visa Status"
											tooltip="What is your current Visa/Citizenship status?"
										>
											<VisaStatus
												disableButtons={this.state.disableButtons}
												visaStatus={
													this.state.profileData
														.visaStatus
												}
												visaExpiryDate={
													this.state.profileData
														.visaExpiryDate
												}
												updateProfileData={
													this.updateWithoutSave
												}
												saveProfileData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Status"
											tooltip="What is your current status in jobseeking?"
										>
											<TalentStatus
												disableButtons={this.state.disableButtons}
												status={
													this.state.profileData
														.jobSeekingStatus !==
													null
														? this.state.profileData
																.jobSeekingStatus
														: {
																status: "",
																availableDate:
																	"",
														  }
												}
												updateProfileData={
													this.updateWithoutSave
												}
												saveProfileData={
													this.updateAndSaveData
												}
											/>
										</FormItemWrapper>
										<FormItemWrapper
											title="Profile Photo"
											tooltip="Please upload your profile photo"
											hideSegment={true}
										>
											<PhotoUpload
												disableButtons={this.state.disableButtons}
												userId={
													this.state.profileData.id
												}
												imageId={
													this.state.profileData
														.profilePhotoUrl
												}
												updateProfileData={
													this.updateWithoutSave
												}
												loadData={this.loadData}
												savePhotoUrl="https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateProfilePhoto"
											/>
										</FormItemWrapper>
										{/* <FormItemWrapper
                                            title='Profile Video'
                                            tooltip='Upload a brief self-introduction video'
                                            hideSegment={true}
                                        >
                                            <VideoUpload
                                                videoName={this.state.profileData.videoName}
                                                updateProfileData={this.updateWithoutSave}
                                                saveVideoUrl={'https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateTalentVideo'}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='CV'
                                            tooltip='Upload your CV. Accepted files are pdf, doc & docx)'
                                            hideSegment={true}
                                        >
                                            <CVUpload
                                                cvName={this.state.profileData.cvName}
                                                cvUrl={this.state.profileData.cvUrl}
                                                updateProfileData={this.updateWithoutSave}
                                                saveCVUrl={'https://talentservicesprofilenik.azurewebsites.net/profile/profile/updateTalentCV'}
                                            />
                                        </FormItemWrapper> */}
									</div>
								</form>
							</div>
						</div>
					</div>
				</section>
			</BodyWrapper>
		);
	}
}
