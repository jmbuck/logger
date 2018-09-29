import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import PreferencePanel from "./PreferencePanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("PreferencePanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<PreferencePanel />);

        expect(component).toMatchSnapshot();
    });
});

