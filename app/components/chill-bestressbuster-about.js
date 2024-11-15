import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import sc from '../../config/styles';

const propTypes = {
};

export default class MeBeStressbusterAbout extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const styles = this.constructor.styles;

		return (
			<View style={styles.container}>
        <ScrollView>
					<Text style={styles.text}>

						<Text style={styles.title}>
							1 Apply Right Here, Right Now!
						</Text>
						{"\n"}{"\n"}
						Complete the Stressbusters fast application form (right) and submit it to the Stressbusters program. 
						{"\n"}{"\n"}

						<Text style={styles.title}>
							2 Meet the Stressbusters Program Coordinators
						</Text>
						{"\n"}{"\n"}
						If your application is accepted, you will be invited for a short interview to make sure that you and the Stressbusters program are a good match.
						{"\n"}{"\n"}

						<Text style={styles.title}>
							3 Get Trained
						</Text>
						{"\n"}{"\n"}
						After a successful interview, you will participate in a 3-4 hour training with other students where you will learn the Stressbusters technique. If you complete training according to Stressbusters standards, you’ll be ready to bust stress at Stressbusters events!
						{"\n"}{"\n"}

						<Text style={styles.title}>
							FAQs ABOUT BEING A STRESSBUSTER
						</Text>
						{"\n"}{"\n"}

						<Text style={styles.title}>
							What are the benefits of being a Stressbuster?
						</Text>
						{"\n"}{"\n"}
						• Learn effective backrub techniques{"\n"}
						• Meet and team with other students committed to helping people be healthier{"\n"}
						• Participate when and where you want{"\n"}
						• Get experience working on a high-profile wellness initiative{"\n"}
						• Make a huge difference in peoples’ days{"\n"}
						• Access special academic and career connections{"\n"}
						• Have fun, make friends and reduce your own stress{"\n"}
						{"\n"}{"\n"}

						<Text style={styles.title}>
							What kind of training will I receive in order to become a Stressbuster?
						</Text>
						{"\n"}{"\n"}
						During a 3-4 hour training workshop co-led by a Licensed Massage Therapist, you will learn:
						{"\n"}{"\n"}
						• How to provide simple, low-intensity backrub techniques{"\n"}
						• Essential communication with backrub recipients{"\n"}
						• Key campus wellness resources and how to access them{"\n"}
						• Strategies for successful backrubs and events{"\n"}
						{"\n"}{"\n"}

						<Text style={styles.title}>
							Are Stressbusters paid?
						</Text>
						{"\n"}{"\n"}
						No. Stressbusters are community service volunteers, and your training will in no way qualify you to provide services akin to what a licensed massage therapist or physical therapist offers for a fee. Similarly, event attendees do not pay for backrubs.
						{"\n"}{"\n"}

						<Text style={styles.title}>
							What’s the time requirement for being a Stressbuster?
						</Text>
						{"\n"}{"\n"}
						In addition to the training, participation in at least five events each semester is required.  Since the average event is one-hour in duration, your total minimum time commitment to the program will be approximately 9 hours per semester.  
						{"\n"}{"\n"}

						<Text style={styles.title}>
							Where are Stressbusters events held and will I ever be the only Stressbuster at an event?
						</Text>
						{"\n"}{"\n"}
						You will never bust alone; you will always be with other Stressbusters, providing backrubs in public spaces. Some examples of Stressbusters event locations and occasions at other schools have included the main library’s mezzanine every Wednesday, residence hall lounges for study breaks, health service waiting areas, the student center and in classroom buildings during midterms. 
						{"\n"}{"\n"}

						<Text style={styles.title}>
							Do these backrubs and the Stressbusters program make any difference?
						</Text>
						{"\n"}{"\n"}
						Yes! Formal evaluation of the impact of the Stressbusters program indicates significantly reduced stress, overwhelmed feelings and muscle tension among participants following a single Stressbusters event. Stressbustees also report feeling better able to complete tasks and cope with stress following their Stressbusters experience. 
						{"\n"}{"\n"}

						<Text style={styles.title}>
							It seems like it might be weird to give or get a backrub in public—is this true?
						</Text>
						{"\n"}{"\n"}
						It can seem strange, but most concerned first-time Stressbusters and backrub recipients say that once you try it, those apprehensions disappear.  The popularity of Stressbusters events combined with the great appreciation that most backrub recipients express, tend to override the natural concern you raised.
						{"\n"}{"\n"}

						<Text style={styles.title}>
							Are there other ways to be involved with Stressbusters?
						</Text>
						{"\n"}{"\n"}
						Stressbusters offers outstanding leadership and resume-building opportunities including program and event coordination, social media communications, marketing, business development, community service, volunteer management and health promotion. Stressbusters team leaders work with students, campus groups, staff and leadership teams at other Stressbusters schools.
						{"\n"}{"\n"}
					</Text>

        </ScrollView>
			</View>
		);
	}


	////////////////////
	// Event Callback //
	////////////////////

}

MeBeStressbusterAbout.propTypes = propTypes;
MeBeStressbusterAbout.styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		...sc.textBold,
		marginBottom: 20,
	},
	text: {
		...sc.text,
		marginBottom: 20,
	},
});
