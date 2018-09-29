import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NetflixPanel from "./NetflixPanel";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("NetflixPanel", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });

    it("should render component", () => {
        const component = Enzyme.shallow(<NetflixPanel />);

        expect(component).toMatchSnapshot();
    });
});

