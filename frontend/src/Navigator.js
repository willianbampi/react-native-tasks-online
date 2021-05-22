import React from 'react'
import { createAppContainer,  createSwitchNavigator } from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer'

import Auth from './screens/Auth'
import ListTask from './screens/ListTask'
import AuthOrApp from './screens/AuthOrApp'
import Menu from './screens/Menu'
import commonStyles from './commonStyles'

const menuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080',
            fontWeight: 'bold'
        }
    }
}

const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <ListTask title='Hoje' daysAhead={0} { ...props } />,
        navigationOprions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <ListTask title='Amanhã' daysAhead={1} { ...props } />,
        navigationOprions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <ListTask title='Semana' daysAhead={7} { ...props } />,
        navigationOprions: {
            title: 'Semana'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <ListTask title='Mês' daysAhead={30} { ...props } />,
        navigationOprions: {
            title: 'Mês'
        }
    }
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)

const mainRoutes = {
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    },
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, { initialRouteName: 'AuthOrApp' })

export default createAppContainer(mainNavigator)