import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WebsitePanel from "./WebsitePanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("WebsitePanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<WebsitePanel />);

        expect(component).toMatchSnapshot();
    });
});

