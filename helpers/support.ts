import { getEnv } from "./general/config.helper";
import "@cypress/xpath";
import { fromMinutes, getTimeText, testTimeout } from "./timeouts";

export function setupCypressHooks() {
    const env = getEnv();
    Cypress.on("window:before:unload", (win: any) => {
        win.fetch = null;
    });

    if (!Cypress.env().noTestTimeout) {
        Cypress.on("test:before:run", (_: unknown, test: any) => {
            const timeout = env.testTimeout ?? 5;
            testTimeout(fromMinutes(timeout), test);
        });
    } else {
        console.log("RUNNING WITH NO TEST TIMEOUT");
    }

    /**
     * Added to handle specific ResizeObserver error
     * Issue: https://github.com/cypress-io/cypress/issues/22113
     */
    Cypress.on("uncaught:exception", (err) => {
        if (err.message.includes("ResizeObserver loop completed with undelivered notifications")) {
            return false;
        }
    });
}

export function setupSpecTimeout(start: number) {
    const timeout = fromMinutes(15);
    const now = +new Date();
    expect(now - start <= timeout, `Describe runtime is under ${getTimeText(timeout)}`).to.be.true;
}

/**  Resets all intercepts and clear cookies if present */
export function clearInterceptsAndCookiesAndSessions() {
    cy.intercept("**", (req) => {
        req.continue();
    });
}

export function getStart() {
    return +new Date();
}
