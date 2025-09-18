export const VENDORS = {
  // Major Cloud Providers
  aws: {
    name: "AWS",
    url: "https://aws.amazon.com/certification/recertification/",
    steps: ["Retake current certification exam", "Pass higher-level AWS certification", "Complete within 3 years of expiration", "Schedule through AWS Training portal"]
  },
  microsoft: {
    name: "Microsoft",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/renew-your-microsoft-certification",
    steps: ["Complete free online renewal assessment", "Available 6 months before expiration", "Pass with 70% or higher score", "Unlimited attempts during renewal window"]
  },
  gcp: {
    name: "Google Cloud",
    url: "https://cloud.google.com/certification/recertification",
    steps: ["Retake certification exam", "Complete within 2 years of expiration", "Schedule through Google Cloud portal"]
  },
  ibm: {
    name: "IBM Cloud",
    url: "https://www.ibm.com/training/certification",
    steps: ["Retake certification exam", "Complete continuing education", "Renew every 3 years"]
  },
  oracle: {
    name: "Oracle",
    url: "https://education.oracle.com/certification-renewal",
    steps: ["Retake certification exam", "Complete Oracle University courses", "Renew before expiration"]
  },
  alibaba: {
    name: "Alibaba Cloud",
    url: "https://edu.alibabacloud.com/certification",
    steps: ["Retake certification exam", "Complete within 2 years", "Schedule through Alibaba portal"]
  },

  // Networking & Infrastructure
  cisco: {
    name: "Cisco",
    url: "https://www.cisco.com/c/en/us/training-events/training-certifications/recertification-policy.html",
    steps: ["Pass current exam or higher-level exam", "Complete Continuing Education credits", "Attend Cisco Live sessions", "Complete before 3-year expiration"]
  },
  juniper: {
    name: "Juniper Networks",
    url: "https://www.juniper.net/us/en/training/certification/recertification.html",
    steps: ["Retake certification exam", "Pass higher-level certification", "Complete within 3 years"]
  },
  fortinet: {
    name: "Fortinet",
    url: "https://training.fortinet.com/local/staticpage/view.php?page=certifications",
    steps: ["Retake certification exam", "Complete training courses", "Renew every 2 years"]
  },
  paloalto: {
    name: "Palo Alto Networks",
    url: "https://www.paloaltonetworks.com/services/education/certification",
    steps: ["Retake certification exam", "Complete continuing education", "Renew every 2 years"]
  },
  f5: {
    name: "F5 Networks",
    url: "https://www.f5.com/services/training/certification",
    steps: ["Retake certification exam", "Complete F5 training", "Renew every 2 years"]
  },
  vmware: {
    name: "VMware",
    url: "https://www.vmware.com/education-services/certification/vcp-recertification.html",
    steps: ["Take VCP exam", "Complete VMware course", "Renew every 2 years"]
  },
  citrix: {
    name: "Citrix",
    url: "https://training.citrix.com/learning/certification",
    steps: ["Retake certification exam", "Complete Citrix training", "Renew every 3 years"]
  },
  hpe: {
    name: "HPE",
    url: "https://education.hpe.com/us/en/certification/index.html",
    steps: ["Retake certification exam", "Complete HPE training", "Renew every 3 years"]
  },
  dell: {
    name: "Dell Technologies",
    url: "https://education.delltechnologies.com/content/dell/en-us/education/certification.html",
    steps: ["Retake certification exam", "Complete Dell training", "Renew every 2 years"]
  },
  aruba: {
    name: "Aruba Networks",
    url: "https://www.arubanetworks.com/support-services/training-services/certification/",
    steps: ["Retake certification exam", "Complete Aruba training", "Renew every 3 years"]
  },

  // Security
  comptia: {
    name: "CompTIA",
    url: "https://www.comptia.org/continuing-education",
    steps: ["Earn 50 Continuing Education Units (CEUs) every 3 years", "Submit CEUs through your CompTIA account", "Pay annual maintenance fee of $25", "Complete by certification expiration date"]
  },
  isc2: {
    name: "(ISC)²",
    url: "https://www.isc2.org/Certifications/CPE",
    steps: ["Earn required CPE credits", "Submit annual CPE report", "Pay annual maintenance fee", "Complete every 3 years"]
  },
  eccouncil: {
    name: "EC-Council",
    url: "https://www.eccouncil.org/programs/continuing-education/",
    steps: ["Earn 120 ECE credits every 3 years", "Submit credits through ECE portal", "Pay annual fee", "Complete by expiration date"]
  },
  sans: {
    name: "SANS/GIAC",
    url: "https://www.giac.org/certifications/maintain",
    steps: ["Earn 36 CPE credits every 4 years", "Submit through GIAC portal", "Pay maintenance fee", "Complete by certification expiration"]
  },
  offensive: {
    name: "Offensive Security",
    url: "https://www.offensive-security.com/courses-and-certifications/",
    steps: ["Retake certification exam", "Complete within 3 years", "No continuing education option"]
  },
  checkpoint: {
    name: "Check Point",
    url: "https://training-certifications.checkpoint.com/",
    steps: ["Retake certification exam", "Complete Check Point training", "Renew every 2 years"]
  },
  crowdstrike: {
    name: "CrowdStrike",
    url: "https://www.crowdstrike.com/university/",
    steps: ["Complete CrowdStrike training", "Retake certification exam", "Renew annually"]
  },
  splunk: {
    name: "Splunk",
    url: "https://www.splunk.com/en_us/training.html",
    steps: ["Retake certification exam", "Complete Splunk training", "Renew every 2 years"]
  },
  rsa: {
    name: "RSA",
    url: "https://community.rsa.com/t5/rsa-university/ct-p/rsa-university",
    steps: ["Complete RSA training", "Retake certification exam", "Renew every 3 years"]
  },
  broadcom: {
    name: "Broadcom",
    url: "https://www.broadcom.com/support/education",
    steps: ["Complete Broadcom training", "Retake certification exam", "Renew every 2 years"]
  },

  // Enterprise Software
  salesforce: {
    name: "Salesforce",
    url: "https://trailhead.salesforce.com/credentials/administratoroverview",
    steps: ["Complete Trailhead modules", "Pass maintenance exams", "Complete annually"]
  },
  servicenow: {
    name: "ServiceNow",
    url: "https://www.servicenow.com/services/training-and-certification.html",
    steps: ["Complete ServiceNow training", "Retake certification exam", "Renew every 18 months"]
  },
  atlassian: {
    name: "Atlassian",
    url: "https://university.atlassian.com/student/catalog",
    steps: ["Complete Atlassian training", "Retake certification exam", "Renew every 2 years"]
  },
  adobe: {
    name: "Adobe",
    url: "https://learning.adobe.com/certification.html",
    steps: ["Complete Adobe training", "Retake certification exam", "Renew every 2 years"]
  },
  autodesk: {
    name: "Autodesk",
    url: "https://www.autodesk.com/certification",
    steps: ["Complete Autodesk training", "Retake certification exam", "Renew every 3 years"]
  },
  ptc: {
    name: "PTC",
    url: "https://www.ptc.com/en/services/training",
    steps: ["Complete PTC training", "Retake certification exam", "Renew every 2 years"]
  },
  dassault: {
    name: "Dassault Systèmes",
    url: "https://www.3ds.com/support/training/",
    steps: ["Complete Dassault training", "Retake certification exam", "Renew every 3 years"]
  },
  siemens: {
    name: "Siemens",
    url: "https://new.siemens.com/global/en/products/services/training.html",
    steps: ["Complete Siemens training", "Retake certification exam", "Renew every 3 years"]
  },

  // Data & Analytics
  tableau: {
    name: "Tableau",
    url: "https://www.tableau.com/learn/certification",
    steps: ["Retake certification exam", "Complete within 2 years", "No continuing education option"]
  },
  powerbi: {
    name: "Microsoft Power BI",
    url: "https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/",
    steps: ["Complete online renewal assessment", "Available 6 months before expiration", "Unlimited attempts"]
  },
  sas: {
    name: "SAS",
    url: "https://www.sas.com/en_us/certification.html",
    steps: ["Retake certification exam", "Complete SAS training", "Renew every 5 years"]
  },
  databricks: {
    name: "Databricks",
    url: "https://www.databricks.com/learn/certification",
    steps: ["Retake certification exam", "Complete within 2 years", "No continuing education option"]
  },
  snowflake: {
    name: "Snowflake",
    url: "https://www.snowflake.com/certifications/",
    steps: ["Retake certification exam", "Complete within 2 years", "No continuing education option"]
  },
  mongodb: {
    name: "MongoDB",
    url: "https://university.mongodb.com/certification",
    steps: ["Retake certification exam", "Complete within 3 years", "No continuing education option"]
  },
  cloudera: {
    name: "Cloudera",
    url: "https://www.cloudera.com/about/training.html",
    steps: ["Retake certification exam", "Complete Cloudera training", "Renew every 2 years"]
  },

  // Project Management & Business
  pmi: {
    name: "PMI",
    url: "https://www.pmi.org/certifications/maintain",
    steps: ["Earn 60 PDUs every 3 years", "Submit PDUs through PMI portal", "Pay renewal fee", "Complete by expiration date"]
  },
  scrumorg: {
    name: "Scrum.org",
    url: "https://www.scrum.org/professional-scrum-certifications",
    steps: ["Certifications do not expire", "Lifetime validity", "No renewal required"]
  },
  safe: {
    name: "Scaled Agile (SAFe)",
    url: "https://www.scaledagile.com/certification/",
    steps: ["Complete SAFe training", "Retake certification exam", "Renew annually"]
  },
  axelos: {
    name: "AXELOS (ITIL/PRINCE2)",
    url: "https://www.axelos.com/certifications",
    steps: ["Complete continuing education", "Earn required credits", "Renew every 3 years"]
  },
  iiba: {
    name: "IIBA",
    url: "https://www.iiba.org/career-resources/a-business-analysts-guide-to-career-development/maintaining-your-certification/",
    steps: ["Earn 60 CDUs every 3 years", "Submit through IIBA portal", "Pay renewal fee", "Complete by expiration"]
  },

  // Development & DevOps
  redhat: {
    name: "Red Hat",
    url: "https://www.redhat.com/en/services/certification",
    steps: ["Retake certification exam", "Complete within 3 years", "No continuing education option"]
  },
  docker: {
    name: "Docker",
    url: "https://www.docker.com/certification",
    steps: ["Retake certification exam", "Complete within 2 years", "No continuing education option"]
  },
  cncf: {
    name: "CNCF (Kubernetes)",
    url: "https://www.cncf.io/certification/",
    steps: ["Retake certification exam", "Complete within 3 years", "No continuing education option"]
  },
  hashicorp: {
    name: "HashiCorp",
    url: "https://www.hashicorp.com/certification",
    steps: ["Retake certification exam", "Complete within 2 years", "No continuing education option"]
  },
  gitlab: {
    name: "GitLab",
    url: "https://about.gitlab.com/services/education/",
    steps: ["Complete GitLab training", "Retake certification exam", "Renew every 2 years"]
  },
  jenkins: {
    name: "Jenkins",
    url: "https://www.jenkins.io/doc/developer/tutorial/",
    steps: ["Complete Jenkins training", "Retake certification exam", "Renew every 2 years"]
  },
  puppet: {
    name: "Puppet",
    url: "https://puppet.com/learning-training/",
    steps: ["Retake certification exam", "Complete within 2 years", "No continuing education option"]
  },
  chef: {
    name: "Chef",
    url: "https://www.chef.io/training",
    steps: ["Complete Chef training", "Retake certification exam", "Renew every 2 years"]
  },

  // Industry Specific
  himss: {
    name: "HIMSS",
    url: "https://www.himss.org/careers-professional-development/certifications",
    steps: ["Earn continuing education credits", "Submit through HIMSS portal", "Renew every 3 years"]
  },
  isaca: {
    name: "ISACA",
    url: "https://www.isaca.org/credentialing/how-to-maintain-your-certification",
    steps: ["Earn 120 CPE hours every 3 years", "Submit annual CPE report", "Pay maintenance fee", "Complete by expiration"]
  },
  cisa: {
    name: "CISA",
    url: "https://www.cisa.gov/cybersecurity-training",
    steps: ["Complete CISA training", "Earn continuing education credits", "Renew every 3 years"]
  },
  nist: {
    name: "NIST",
    url: "https://www.nist.gov/cyberframework",
    steps: ["Complete NIST training", "Earn continuing education credits", "Renew every 3 years"]
  }
} as const;