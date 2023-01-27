// Copyright 2016-2021, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as staticPage from "./staticPage";

export interface DemoArgs {
    staticPage: staticPage.StaticPage;
}

export class Demo extends pulumi.ComponentResource {
    constructor(name: string, args: DemoArgs, opts?: pulumi.ComponentResourceOptions) {
        super("demo:index:Demo", name, args, opts);

        const testRole = new aws.iam.Role('demo-role', {
            name: args.staticPage.bucket.id.apply((id) => `demo-role-${id}`),
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: ["sts:AssumeRole"],
                        Effect: "Allow",
                        Principal: {
                            Service: ["ec2.amazonaws.com"],
                        },
                    },
                ],
            }),
        }, {
            parent: this,
        });
        testRole.name.apply((name) => `testRole.name: ${name}`);
        this.registerOutputs({});
    }
}
