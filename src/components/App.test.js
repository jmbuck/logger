import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from "./App";
import firebase from "firebase";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
    beforeAll(() => {
        firebase.auth = jest.fn().mockReturnValue({
            onAuthStateChanged: true
        });
    });
    
    it('should render correctly with no props', () => {
        const component = Enzyme.shallow(<App />)
        expect(component).toMatchSnapshot();
    });
});

