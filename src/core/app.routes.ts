import { Routes } from '@angular/router';
import { AppLayout } from '../app/layouts/app-layout/app-layout';
import { AuthLayout } from '../app/layouts/auth-layout/auth-layout';
import { appGuard } from './guards/app.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: AppLayout,
        canActivate: [appGuard],
        children: [
            {
                path: "",
                redirectTo: "dashboard",
                pathMatch: "full"
            },
            {
                path: "dashboard",
                title: "Tableau de bord",
                loadComponent: () => import("../app/pages/dashboard/dashboard").then(c => c.Dashboard)
            },
            {
                path: "deliveries",
                title: "Livraisons",
                children: [
                    {
                        path: "",
                        redirectTo: "list",
                        pathMatch: "full"
                    },
                    {
                        path: "list",
                        loadComponent: () => import("../app/pages/deliveries/views/delivery-list/delivery-list").then(c => c.DeliveryList)
                    },
                    {
                        path: "create",
                        loadComponent: () => import("../app/pages/deliveries/views/delivery-form/delivery-form").then(c => c.DeliveryForm)
                    }
                ]
            },
            {
                path: "delivery-prices",
                title: "Frais de livraison",
                loadComponent: () => import("../app/pages/delivery-prices/delivery-prices").then(c => c.DeliveryPrices)
            },
            {
                path: "delivery-men",
                title: "Livreurs",
                loadComponent: () => import("../app/pages/delivery-men/delivery-men").then(c => c.DeliveryMen),
                children: [
                    {
                        path: "",
                        redirectTo: "list",
                        pathMatch: "full"
                    },
                    {
                        path: "list",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-man-list/delivery-man-list").then(c => c.DeliveryManList)
                    },
                    {
                        path: "performance",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-man-performances/delivery-man-performances").then(c => c.DeliveryManPerformances)
                    },
                    {
                        path: "docs",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-man-docs/delivery-man-docs").then(c => c.DeliveryManDocs)
                    },
                    {
                        path: "location",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-men-location-map/delivery-men-location-map").then(c => c.DeliveryMenLocationMap)
                    },
                    {
                        path: "salaries",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-man-salaries/delivery-man-salaries").then(c => c.DeliveryManSalaries)
                    },
                    {
                        path: "bonuses",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-man-bonuses/delivery-man-bonuses").then(c => c.DeliveryManBonuses)
                    },
                    {
                        path: "rates",
                        loadComponent: () => import("../app/pages/delivery-men/views/delivery-man-rates/delivery-man-rates").then(c => c.DeliveryManRates)
                    }
                ]
            },
            {
                path: "owners",
                title: "Propriétaires",
                loadComponent: () => import("../app/pages/owners/owners").then(c => c.Owners)
            }
        ]
    },
    {
        path: "authentication",
        canActivate: [authGuard],
        component: AuthLayout,
        children: [
            {
                path: "",
                redirectTo: "signin",
                pathMatch: "full"
            },
            {
                path: "signin",
                title: "Connexion",
                loadComponent: () => import("../app/pages/authentication/sign-in/sign-in").then(c => c.SignIn)
            }
        ]
    },
    { path: "**", redirectTo: "" }
];
