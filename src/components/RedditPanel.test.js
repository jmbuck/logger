import React from 'react';
import Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from "./App";
import { RedditPanel } from './RedditPanel'
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should create component", () => {
        //const component = Enzyme.shallow(<App />);

        console.log(component);
    });
});


describe('Retrieve user reddit data', () => {
    it('renders correctly', () => {
        const wrapper = shallow(
            <RedditPanel
                data= {
                        {
                            "gifs": {
                                "time" : 4634
                            },
                            "news" : {
                                "time" : 9678
                            },
                            "sports" : {
                                "time" : 1555
                            },
                            "todayilearned" : {
                                "time" : 8818
                            }
                        }
                }
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});

