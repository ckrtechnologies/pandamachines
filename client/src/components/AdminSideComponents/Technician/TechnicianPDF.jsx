import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet
} from "@react-pdf/renderer";

const COLORS = {
    primary: "#003A6B",
    primaryLight: "#004F94",
    accent: "#E84C00",
    accentLight: "#FF6B1A",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    border: "#E5E7EB",
    borderLight: "#F3F4F6",
    background: "#FFFFFF",
    surfaceLight: "#F8FAFC",
    headerBg: "#001F3F",
    tagBg: "#EEF4FB",
    tagText: "#003A6B",
    badgeActive: "#DCFCE7",
    badgeActiveText: "#166534",
    badgeInactive: "#FEF9C3",
    badgeInactiveText: "#854D0E"
};

const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 10,
        fontFamily: "Helvetica",
        backgroundColor: COLORS.background
    },

    /*  Header  */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.headerBg,
        paddingHorizontal: 30,
        paddingVertical: 18
    },

    brandLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },

    logo: {
        width: 50,
        height: 40
    },

    brandName: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#FFFFFF",
        letterSpacing: 0.5
    },

    brandTagline: {
        fontSize: 9,
        color: "#93C5FD",
        marginTop: 2,
        letterSpacing: 0.3
    },

    headerRight: {
        alignItems: "flex-end",
        gap: 3
    },

    headerDate: {
        fontSize: 9,
        color: "#BFDBFE",
        letterSpacing: 0.3
    },

    headerLabel: {
        fontSize: 8,
        color: "#64748B"
    },

    /*  Content Wrapper  */
    contentWrapper: {
        paddingHorizontal: 30,
        paddingTop: 20,
        paddingBottom: 20
    },

    /*  Page Sub-header (non-first pages)  */
    pageSubHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 10,
        backgroundColor: COLORS.surfaceLight,
        borderBottom: `1px solid ${COLORS.border}`
    },

    pageSubHeaderText: {
        fontSize: 8,
        color: COLORS.textMuted,
        letterSpacing: 0.4
    },

    /*  Section Card  */
    section: {
        marginBottom: 14,
        borderRadius: 6,
        border: `1px solid ${COLORS.border}`,
        overflow: "hidden"
    },

    sectionInner: {
        flexDirection: "row"
    },

    /*  Index Bar  */
    indexBar: {
        width: 28,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 16
    },

    indexText: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#FFFFFF"
    },

    /*  Left Content  */
    left: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 0
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
    },

    name: {
        fontSize: 15,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        letterSpacing: 0.2
    },

    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10
    },

    statusText: {
        fontSize: 8,
        fontWeight: "bold",
        letterSpacing: 0.5
    },

    divider: {
        height: 1,
        backgroundColor: COLORS.borderLight,
        marginBottom: 12
    },

    rowInline: {
        flexDirection: "row",
        marginBottom: 11,
        gap: 10
    },

    col: {
        flex: 1
    },

    fullRow: {
        marginBottom: 4
    },

    /*  Label: smaller, more spaced, uppercase — cleaner hierarchy  */
    label: {
        fontSize: 7,
        color: COLORS.textMuted,
        letterSpacing: 0.9,
        marginBottom: 4,
        textTransform: "uppercase",
        fontFamily: "Helvetica"
    },

    /*  Value: slightly larger, tighter tracking, comfortable line-height  */
    value: {
        fontSize: 10.5,
        color: COLORS.textPrimary,
        letterSpacing: 0.1,
        lineHeight: 1.45,
        fontFamily: "Helvetica"
    },

    /*  Salary: prominent, primary-coloured, bold  */
    salaryValue: {
        fontSize: 11.5,
        color: COLORS.primary,
        fontWeight: "bold",
        letterSpacing: 0.2,
        fontFamily: "Helvetica-Bold"
    },

    operatorTag: {
        backgroundColor: COLORS.tagBg,
        borderRadius: 3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        alignSelf: "flex-start"
    },

    operatorTagText: {
        fontSize: 10,
        color: COLORS.tagText,
        fontWeight: "bold",
        letterSpacing: 0.1,
        fontFamily: "Helvetica-Bold"
    },

    /*  Right Image Panel  */
    right: {
        width: 148,
        backgroundColor: COLORS.surfaceLight,
        borderLeft: `1px solid ${COLORS.border}`,
        padding: 10,
        gap: 8,
        alignItems: "center",
        justifyContent: "center"
    },

    imageWrapper: {
        width: 128,
        gap: 4
    },

    imageLabel: {
        fontSize: 7,
        color: COLORS.textMuted,
        letterSpacing: 0.5,
        textAlign: "center",
        marginBottom: 2
    },

    image: {
        width: 128,
        height: 80,
        borderRadius: 4,
        border: `1px solid ${COLORS.border}`
    },

    /*  Footer  */
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderTop: `1px solid ${COLORS.border}`,
        backgroundColor: COLORS.surfaceLight
    },

    footerText: {
        fontSize: 7.5,
        color: COLORS.textMuted,
        letterSpacing: 0.3
    },

    footerAccent: {
        color: COLORS.primary,
        fontWeight: "bold"
    }
});

const formatINR = (value) => {
    if (value === null || value === undefined) return "Rs. 0";
    return `Rs. ${Number(value).toLocaleString("en-IN")}`;
};

/*  Status Badge  */
const StatusBadge = ({ status }) => {
    const isActive = status && status.toLowerCase() === "active";

    return (
        <View
            style={[
                styles.statusBadge,
                {
                    backgroundColor: isActive
                        ? COLORS.badgeActive
                        : COLORS.badgeInactive
                }
            ]}
        >
            <Text
                style={[
                    styles.statusText,
                    {
                        color: isActive
                            ? COLORS.badgeActiveText
                            : COLORS.badgeInactiveText
                    }
                ]}
            >
                {status ? status.toUpperCase() : "UNKNOWN"}
            </Text>
        </View>
    );
};

/*  Section Card  */
const Section = ({ tech, index }) => (
    <View style={styles.section} wrap={false}>
        <View style={styles.sectionInner}>

            {/* Index bar */}
            <View style={styles.indexBar}>
                <Text style={styles.indexText}>{index + 1}</Text>
            </View>

            {/* Left details */}
            <View style={styles.left}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{tech.name}</Text>
                    <StatusBadge status={tech.status} />
                </View>

                <View style={styles.divider} />

                <View style={styles.rowInline}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Operator</Text>
                        <View style={styles.operatorTag}>
                            <Text style={styles.operatorTagText}>
                                {tech.operatorName}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.rowInline}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Mobile</Text>
                        <Text style={styles.value}>{tech.mobileNumber}</Text>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.label}>WhatsApp</Text>
                        <Text style={styles.value}>{tech.whatsappNumber}</Text>
                    </View>
                </View>

                <View style={styles.rowInline}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Salary Range</Text>
                        <Text style={styles.salaryValue}>
                            {formatINR(tech.expectedSalaryMin)} {"\u2013"} {formatINR(tech.expectedSalaryMax)}
                        </Text>
                    </View>
                </View>

                <View style={styles.fullRow}>
                    <Text style={styles.label}>Address</Text>
                    <Text style={styles.value}>{tech.address}</Text>
                </View>
            </View>

            {/* Right image panel */}
            <View style={styles.right}>
                {tech.aadharFront && (
                    <View style={styles.imageWrapper}>
                        <Text style={styles.imageLabel}>AADHAAR FRONT</Text>
                        <Image src={tech.aadharFront} style={styles.image} />
                    </View>
                )}
                {tech.aadharBack && (
                    <View style={styles.imageWrapper}>
                        <Text style={styles.imageLabel}>AADHAAR BACK</Text>
                        <Image src={tech.aadharBack} style={styles.image} />
                    </View>
                )}
            </View>

        </View>
    </View>
);

/*  Page Header  */
const PageHeader = () => (
    <View style={styles.header} fixed>
        <View style={styles.brandLeft}>
            <Image
                src={window.location.origin + "/logo.png"}
                style={styles.logo}
            />
            <View>
                <Text style={styles.brandName}>Panda Machines</Text>
                <Text style={styles.brandTagline}>Technician Report</Text>
            </View>
        </View>

        <View style={styles.headerRight}>
            <Text style={styles.headerDate}>
                {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                })}
            </Text>
            <Text style={styles.headerLabel}>GENERATED ON</Text>
        </View>
    </View>
);

/*  Page Footer  */
const PageFooter = () => (
    <View style={styles.footer} fixed>
        <Text style={styles.footerText}>
            <Text style={styles.footerAccent}>Panda Machines</Text>
            {"  \u2014  Confidential Technician Report"}
        </Text>
        <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
            }
        />
    </View>
);

/*  Main PDF Document  */
const TechnicianPDF = ({ data }) => {
    const firstPageData = data.slice(0, 3);
    const remainingData = data.slice(3);

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const otherPages = chunkArray(remainingData, 4);

    return (
        <Document>

            {/* FIRST PAGE */}
            <Page size="A4" style={styles.page}>
                <PageHeader />

                <View style={styles.contentWrapper}>
                    {firstPageData.map((tech, index) => (
                        <Section key={tech._id} tech={tech} index={index} />
                    ))}
                </View>

                <PageFooter />
            </Page>

            {/* OTHER PAGES */}
            {otherPages.map((pageData, pageIndex) => (
                <Page key={pageIndex} size="A4" style={styles.page}>
                    <PageHeader />

                    <View style={styles.pageSubHeader}>
                        <Text style={styles.pageSubHeaderText}>
                            CONTINUED FROM PREVIOUS PAGE
                        </Text>
                        <Text style={styles.pageSubHeaderText}>
                            RECORDS {pageIndex * 4 + 4} {"\u2013"}{" "}
                            {pageIndex * 4 + 3 + pageData.length}
                        </Text>
                    </View>

                    <View style={styles.contentWrapper}>
                        {pageData.map((tech, index) => (
                            <Section
                                key={tech._id}
                                tech={tech}
                                index={pageIndex * 4 + index + 3}
                            />
                        ))}
                    </View>

                    <PageFooter />
                </Page>
            ))}

        </Document>
    );
};

export default TechnicianPDF;