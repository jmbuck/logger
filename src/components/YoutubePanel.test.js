import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import YoutubePanel from "./YoutubePanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("YoutubePanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<YoutubePanel />);

        expect(component).toMatchSnapshot();
    });
});

